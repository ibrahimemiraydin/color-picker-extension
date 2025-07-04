let currentColor = { hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } }; // Önbellek
let isMinimized = false;
let colorHistory = []; // Renk geçmişi dizisi

// Uzantı yüklendiğinde renk geçmişini al
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['colorHistory'], (result) => {
    if (result.colorHistory) {
      colorHistory = result.colorHistory;
      updateHistoryGrid();
    }
    console.log('Renk geçmişi yüklendi:', colorHistory);
  });
});

document.getElementById('pickColor').addEventListener('click', async () => {
  console.log('Renk Seç butonuna tıklandı');
  
  if (!window.EyeDropper) {
    console.error('EyeDropper API desteklenmiyor');
    showToast('EyeDropper API desteklenmiyor. Chrome 95+ kullanın.', true);
    return;
  }

  try {
    console.log('EyeDropper başlatılıyor');
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    const hexColor = result.sRGBHex.toUpperCase();
    console.log('Seçilen renk:', hexColor);
    
    currentColor.hex = hexColor;
    currentColor.rgb = hexToRgb(hexColor);
    
    document.getElementById('colorDisplay').style.backgroundColor = hexColor;
    document.getElementById('currentHex').textContent = hexColor;
    updateColorCodes();
    addToHistory(hexColor);
  } catch (error) {
    if (error.toString().includes('AbortError')) {
      console.log('Renk seçimi kullanıcı tarafından iptal edildi');
    } else {
      console.error('Renk seçimi hatası:', error);
      showToast('Renk seçiminde hata oluştu', true);
    }
  }
});

document.getElementById('colorDisplay').addEventListener('click', (event) => {
  event.preventDefault();
  const historyPanel = document.getElementById('historyPanel');
  historyPanel.style.display = historyPanel.style.display === 'none' ? 'block' : 'none';
  console.log(`Geçmiş paneli ${historyPanel.style.display === 'block' ? 'açıldı' : 'kapatıldı'}`);
});

document.getElementById('colorDisplay').addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    const historyPanel = document.getElementById('historyPanel');
    historyPanel.style.display = historyPanel.style.display === 'none' ? 'block' : 'none';
    console.log(`Geçmiş paneli ${historyPanel.style.display === 'block' ? 'açıldı' : 'kapatıldı'}`);
  }
});

document.addEventListener('click', (event) => {
  const historyPanel = document.getElementById('historyPanel');
  const colorDisplay = document.getElementById('colorDisplay');
  if (!historyPanel.contains(event.target) && !colorDisplay.contains(event.target)) {
    historyPanel.style.display = 'none';
    console.log('Geçmiş paneli dış tıklama ile kapatıldı');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const historyPanel = document.getElementById('historyPanel');
    historyPanel.style.display = 'none';
    console.log('Geçmiş paneli Escape tuşu ile kapatıldı');
  }
});

document.getElementById('toggleSize').addEventListener('click', () => {
  isMinimized = !isMinimized;
  document.body.classList.toggle('minimized', isMinimized);
  const minimizeIcon = document.querySelector('.minimize-icon');
  const maximizeIcon = document.querySelector('.maximize-icon');
  const toggleBtn = document.getElementById('toggleSize');
  
  if (isMinimized) {
    minimizeIcon.style.display = 'none';
    maximizeIcon.style.display = 'block';
    toggleBtn.setAttribute('title', 'Büyült');
    toggleBtn.setAttribute('aria-label', 'Büyült');
    document.getElementById('historyPanel').style.display = 'none';
  } else {
    minimizeIcon.style.display = 'block';
    maximizeIcon.style.display = 'none';
    toggleBtn.setAttribute('title', 'Küçült');
    toggleBtn.setAttribute('aria-label', 'Küçült');
  }
  console.log(`Popup ${isMinimized ? 'küçültüldü' : 'büyültüldü'}`);
});

document.querySelectorAll('.copy-btn').forEach(button => {
  button.addEventListener('click', () => {
    const format = button.getAttribute('data-format');
    const codeElement = document.getElementById(`${format}Code`);
    const colorCode = codeElement.textContent;
    
    navigator.clipboard.writeText(colorCode).then(() => {
      console.log(`Kopyalandı: ${format.toUpperCase()} - ${colorCode}`);
      showToast(`${format.toUpperCase()} kodu kopyalandı: ${colorCode}`);
      const originalContent = button.innerHTML;
      button.innerHTML = '<span class="material-symbols-outlined">check</span>';
      button.style.color = '#4BB543';
      setTimeout(() => {
        button.innerHTML = '<span class="material-symbols-outlined">content_copy</span>';
        button.style.color = '';
      }, 2000);
    }).catch((err) => {
      console.error('Kopyalama hatası:', err);
      showToast(`${format.toUpperCase()} kopyalama başarısız`, true);
    });
  });
});

function addToHistory(hexColor) {
  if (!colorHistory.includes(hexColor)) {
    colorHistory.unshift(hexColor); // Yeni rengi başa ekle
    if (colorHistory.length > 16) {
      colorHistory.pop(); // Maksimum 16 renk
    }
    chrome.storage.local.set({ colorHistory }, () => {
      console.log('Renk geçmişi kaydedildi:', colorHistory);
    });
    updateHistoryGrid();
  }
}

function updateHistoryGrid() {
  const historyGrid = document.getElementById('historyGrid');
  historyGrid.innerHTML = ''; // Önceki kutucukları temizle
  colorHistory.forEach((color, index) => {
    const colorBox = document.createElement('div');
    colorBox.className = 'history-color';
    colorBox.style.backgroundColor = color;
    colorBox.setAttribute('aria-label', `Geçmiş renk ${index + 1}: ${color}`);
    colorBox.setAttribute('tabindex', '0');
    colorBox.addEventListener('click', () => {
      currentColor.hex = color;
      currentColor.rgb = hexToRgb(color);
      document.getElementById('colorDisplay').style.backgroundColor = color;
      document.getElementById('currentHex').textContent = color;
      updateColorCodes();
      document.getElementById('historyPanel').style.display = 'none';
      console.log(`Geçmiş renk seçildi: ${color}`);
    });
    colorBox.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        currentColor.hex = color;
        currentColor.rgb = hexToRgb(color);
        document.getElementById('colorDisplay').style.backgroundColor = color;
        document.getElementById('currentHex').textContent = color;
        updateColorCodes();
        document.getElementById('historyPanel').style.display = 'none';
        console.log(`Geçmiş renk seçildi: ${color}`);
      }
    });
    historyGrid.appendChild(colorBox);
  });
  console.log('Renk geçmişi güncellendi:', colorHistory);
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.backgroundColor = isError ? '#d90429' : '#333';
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function rgbToCmyk(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

function rgbToHwb(r, g, b) {
  const { h } = rgbToHsl(r, g, b);
  const w = Math.min(r, g, b) / 255 * 100;
  const bValue = (1 - Math.max(r, g, b) / 255) * 100;
  return {
    h: Math.round(h),
    w: Math.round(w),
    b: Math.round(bValue)
  };
}

function rgbToXyz(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  r *= 100;
  g *= 100;
  b *= 100;
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    z: Math.round(z * 100) / 100
  };
}

function rgbToLab(r, g, b) {
  const { x, y, z } = rgbToXyz(r, g, b);
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;
  let xNorm = x / refX;
  let yNorm = y / refY;
  let zNorm = z / refZ;
  xNorm = xNorm > 0.008856 ? Math.pow(xNorm, 1/3) : (7.787 * xNorm) + 16/116;
  yNorm = yNorm > 0.008856 ? Math.pow(yNorm, 1/3) : (7.787 * yNorm) + 16/116;
  zNorm = zNorm > 0.008856 ? Math.pow(zNorm, 1/3) : (7.787 * zNorm) + 16/116;
  const l = (116 * yNorm) - 16;
  const a = 500 * (xNorm - yNorm);
  const bValue = 200 * (yNorm - zNorm);
  return {
    l: Math.round(l * 100) / 100,
    a: Math.round(a * 100) / 100,
    b: Math.round(bValue * 100) / 100
  };
}

function updateColorCodes() {
  const { hex, rgb: { r, g, b } } = currentColor;
  const { h, s, l } = rgbToHsl(r, g, b);
  const { c, m, y, k } = rgbToCmyk(r, g, b);
  const { h: hwbH, w, b: hwbB } = rgbToHwb(r, g, b);
  const { x, y: yXyz, z } = rgbToXyz(r, g, b);
  const { l: labL, a, b: labB } = rgbToLab(r, g, b);

  document.getElementById('hexCode').textContent = hex;
  document.getElementById('rgbCode').textContent = `rgb(${r}, ${g}, ${b})`;
  document.getElementById('hslCode').textContent = `hsl(${h}, ${s}%, ${l}%)`;
  document.getElementById('cmykCode').textContent = `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
  document.getElementById('hwbCode').textContent = `hwb(${hwbH}, ${w}%, ${hwbB}%)`;
  document.getElementById('labCode').textContent = `lab(${labL}, ${a}, ${labB})`;
  document.getElementById('xyzCode').textContent = `xyz(${x}, ${yXyz}, ${z})`;
}