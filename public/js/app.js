// Variables globales
let currentToken = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');

// Configuración de la API
const API_BASE_URL = window.location.origin + '/api';

// Funciones de navegación
function showSection(sectionId) {
  // Ocultar todas las secciones
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Mostrar la sección seleccionada
  document.getElementById(sectionId).classList.add('active');
  
  // Cargar datos específicos de la sección
  switch(sectionId) {
    case 'products':
      loadProducts();
      break;
    case 'news':
      loadNews('technology');
      break;
    case 'weather':
      // El clima se carga bajo demanda
      break;
  }
  
  // Cerrar menú móvil si está abierto
  document.querySelector('.nav-menu').classList.remove('active');
}

// Funciones de autenticación
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Guardar token y usuario
      currentToken = data.token;
      currentUser = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      alert('¡Inicio de sesión exitoso!');
      showSection('home');
      updateUIForLoggedInUser();
    } else {
      alert(data.error || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión. Por favor, intenta de nuevo.');
  }
}

function handleLogout() {
  currentToken = null;
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateUIForLoggedOutUser();
  showSection('home');
}

function updateUIForLoggedInUser() {
  // Actualizar interfaz para usuario logueado
  const loginLink = document.querySelector('a[onclick="showSection(\'login\')"]');
  if (loginLink) {
    loginLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar Sesión';
    loginLink.onclick = handleLogout;
  }
}

function updateUIForLoggedOutUser() {
  // Actualizar interfaz para usuario no logueado
  const loginLink = document.querySelector('a[onclick="handleLogout()"]');
  if (loginLink) {
    loginLink.innerHTML = '<i class="fas fa-user"></i> Login';
    loginLink.onclick = () => showSection('login');
  }
}

// Funciones de productos
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    
    if (response.ok) {
      displayProducts(data.products);
    } else {
      console.error('Error al cargar productos:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayProducts(products) {
  const productsList = document.getElementById('productsList');
  productsList.innerHTML = '';
  
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-image">
        <i class="fas fa-microchip"></i>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price">$${product.price}</div>
        <div class="product-specs">
          <h4>Especificaciones:</h4>
          <ul>
            ${Object.entries(product.specifications).map(([key, value]) => 
              `<li><strong>${key}:</strong> ${value}</li>`
            ).join('')}
          </ul>
        </div>
        <div class="product-meta">
          <span><strong>Marca:</strong> ${product.brand}</span>
          <span><strong>Stock:</strong> ${product.stock}</span>
        </div>
      </div>
    `;
    productsList.appendChild(productCard);
  });
}

// Funciones de noticias
async function loadNews(category = 'technology') {
  try {
    const response = await fetch(`${API_BASE_URL}/news/${category}`);
    const data = await response.json();
    
    if (response.ok) {
      displayNews(data.data.articles);
    } else {
      console.error('Error al cargar noticias:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayNews(articles) {
  const newsList = document.getElementById('newsList');
  newsList.innerHTML = '';
  
  articles.forEach(article => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';
    newsCard.innerHTML = `
      <div class="news-image">
        <i class="fas fa-newspaper"></i>
      </div>
      <div class="news-content">
        <h3 class="news-title">${article.title}</h3>
        <p class="news-description">${article.description}</p>
        <div class="news-meta">
          <span class="news-category">${article.category}</span>
          <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    `;
    newsList.appendChild(newsCard);
  });
}

// Funciones de clima
async function getWeather() {
  const city = document.getElementById('cityInput').value;
  
  if (!city) {
    alert('Por favor ingresa una ciudad');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/weather/current/${city}`, {
      headers: {
        'Authorization': `Bearer ${currentToken}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      displayWeather(data.data);
    } else {
      alert(data.error || 'Error al obtener el clima');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión. Por favor, intenta de nuevo.');
  }
}

function displayWeather(weatherData) {
  const weatherResult = document.getElementById('weatherResult');
  weatherResult.innerHTML = `
    <div class="weather-info">
      <h3>${weatherData.city}, ${weatherData.country}</h3>
      <div class="weather-temp">${weatherData.temperature}°C</div>
      <p>${weatherData.weather[0].description}</p>
      <div class="weather-details">
        <div class="weather-detail">
          <i class="fas fa-tint"></i>
          <div>Humedad: ${weatherData.humidity}%</div>
        </div>
        <div class="weather-detail">
          <i class="fas fa-wind"></i>
          <div>Viento: ${weatherData.wind_speed} m/s</div>
        </div>
        <div class="weather-detail">
          <i class="fas fa-thermometer-half"></i>
          <div>Sensación: ${weatherData.feels_like}°C</div>
        </div>
        <div class="weather-detail">
          <i class="fas fa-compress-arrows-alt"></i>
          <div>Presión: ${weatherData.pressure} hPa</div>
        </div>
      </div>
    </div>
  `;
}

// Funciones de utilidad
function showRegister() {
  alert('Función de registro no implementada en esta demo. Usa las credenciales de prueba.');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Menú hamburguesa
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
  });
  
  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
    });
  });
  
  // Actualizar UI según estado de autenticación
  if (currentToken && currentUser) {
    updateUIForLoggedInUser();
  }
  
  // Filtros de productos
  const productSearch = document.getElementById('productSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  
  if (productSearch) {
    productSearch.addEventListener('input', function() {
      // Implementar búsqueda en tiempo real
      console.log('Buscando:', this.value);
    });
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      // Implementar filtro por categoría
      console.log('Filtrando por categoría:', this.value);
    });
  }
  
  // Enter key para búsqueda de clima
  const cityInput = document.getElementById('cityInput');
  if (cityInput) {
    cityInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        getWeather();
      }
    });
  }
});

// Manejo de errores global
window.addEventListener('error', function(e) {
  console.error('Error global:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Promesa rechazada no manejada:', e.reason);
});