# Script de Prueba Rápida - Dark Souls Wiki API
# Este script prueba todos los endpoints principales

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Dark Souls Wiki - Test de API" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3002"
$email = "test_$(Get-Random)@darksouls.com"
$password = "password123"

# Test 1: Registro
Write-Host "1. Probando Registro..." -ForegroundColor Yellow
$registerBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method Post `
        -Body $registerBody `
        -ContentType "application/json"
    Write-Host "   ✓ Registro exitoso: $($registerResponse.user.email)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error en registro: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 2: Login
Write-Host "2. Probando Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "   ✓ Login exitoso. Token obtenido." -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

Start-Sleep -Seconds 1

# Test 3: Listar Jefes
Write-Host "3. Probando GET /api/bosses..." -ForegroundColor Yellow
try {
    $bosses = Invoke-RestMethod -Uri "$baseUrl/api/bosses" -Method Get
    Write-Host "   ✓ Obtenidos $($bosses.Count) jefes" -ForegroundColor Green
    foreach ($boss in $bosses) {
        Write-Host "      - $($boss.name)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ✗ Error al obtener jefes: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 4: Detalles de Jefe (con videos)
Write-Host "4. Probando GET /api/bosses/1 (con videos YouTube)..." -ForegroundColor Yellow
try {
    $boss = Invoke-RestMethod -Uri "$baseUrl/api/bosses/1" -Method Get
    Write-Host "   ✓ Jefe: $($boss.name)" -ForegroundColor Green
    if ($boss.videos) {
        Write-Host "   ✓ Videos encontrados: $($boss.videos.Count)" -ForegroundColor Green
    } else {
        Write-Host "   ! No hay videos (YouTube API key no configurada)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Error al obtener detalles: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 5: Crear Comentario SIN token (debe fallar)
Write-Host "5. Probando crear comentario SIN token (debe fallar)..." -ForegroundColor Yellow
$commentBody = @{
    content = "Test sin token"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/bosses/1/comments" `
        -Method Post `
        -Body $commentBody `
        -ContentType "application/json"
    Write-Host "   ✗ ERROR: Debería haber fallado!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   ✓ Correctamente rechazado (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "   ? Error inesperado: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Start-Sleep -Seconds 1

# Test 6: Crear Comentario CON token (debe funcionar)
Write-Host "6. Probando crear comentario CON token..." -ForegroundColor Yellow
$commentBody = @{
    content = "¡Artorias es increíble! Test automatizado."
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $comment = Invoke-RestMethod -Uri "$baseUrl/api/bosses/1/comments" `
        -Method Post `
        -Body $commentBody `
        -ContentType "application/json" `
        -Headers $headers
    Write-Host "   ✓ Comentario creado: ID $($comment.id)" -ForegroundColor Green
    $commentId = $comment.id
} catch {
    Write-Host "   ✗ Error al crear comentario: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 7: Listar Comentarios
Write-Host "7. Probando GET /api/bosses/1/comments..." -ForegroundColor Yellow
try {
    $comments = Invoke-RestMethod -Uri "$baseUrl/api/bosses/1/comments" -Method Get
    Write-Host "   ✓ Obtenidos $($comments.Count) comentarios" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error al obtener comentarios: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 8: Eliminar Comentario
if ($commentId) {
    Write-Host "8. Probando DELETE /api/comments/$commentId..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $response = Invoke-RestMethod -Uri "$baseUrl/api/comments/$commentId" `
            -Method Delete `
            -Headers $headers
        Write-Host "   ✓ Comentario eliminado exitosamente" -ForegroundColor Green
    } catch {
        Write-Host "   ✗ Error al eliminar comentario: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Pruebas Completadas" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Información para Postman:" -ForegroundColor Yellow
Write-Host "Email: $email" -ForegroundColor White
Write-Host "Password: $password" -ForegroundColor White
Write-Host "Token: $token" -ForegroundColor White
Write-Host ""
Write-Host "Copia el token y úsalo en Postman para las capturas de pantalla." -ForegroundColor Green
