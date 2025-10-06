<?php
$resultadoHTML = '';

if (isset($_GET['busqueda']) && !empty($_GET['busqueda'])) {
    $busqueda = $_GET['busqueda'];

    if (is_numeric($busqueda)) {
        $url = "https://dragonball-api.com/api/characters/$busqueda";
    } else {
        $url = "https://dragonball-api.com/api/characters";
    }

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $respuesta = curl_exec($ch);
    curl_close($ch);
    $datos = json_decode($respuesta, true);

    if (is_numeric($busqueda)) {
        if ($datos && isset($datos['id'])) {
            $resultadoHTML = "
            <div class='carta'>
                <div class='marca-agua'>{$datos['id']}</div>
                <h2>{$datos['name']}</h2>
                <img src='{$datos['image']}' alt='Imagen de {$datos['name']}'>
                <div class='info-extra'>
                    <div><strong>Descripción:</strong><br>{$datos['description']}</div>
                    <div><strong>Ki:</strong><br>{$datos['ki']}</div>
                </div>
            </div>";
        } else {
            $resultadoHTML = "<p class='error'>No se encontró el personaje.</p>";
        }
    } else {
        if ($datos && isset($datos['items'])) {
            $encontrado = false;
            foreach ($datos['items'] as $personaje) {
                if (stripos($personaje['name'], $busqueda) !== false) {
                    $resultadoHTML = "
                    <div class='carta'>
                        <div class='marca-agua'>{$personaje['id']}</div>
                        <h2>{$personaje['name']}</h2>
                        <img src='{$personaje['image']}' alt='Imagen de {$personaje['name']}'>
                        <div class='info-extra'>
                            <div><strong>Descripción:</strong><br>{$personaje['description']}</div>
                            <div><strong>Ki:</strong><br>{$personaje['ki']}</div>
                        </div>
                    </div>";
                    $encontrado = true;
                    break;
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Buscador Dragon Ball</title>
  <link rel="stylesheet" href="styless/styless.css">
</head>
<body>
  <h1>Buscador Dragon Ball</h1>
  <form method="GET">
    <input type="text" name="busqueda" placeholder="ID o nombre">
    <button type="submit">Buscar</button>
  </form>

  <?= $resultadoHTML ?>

</body>
</html>
