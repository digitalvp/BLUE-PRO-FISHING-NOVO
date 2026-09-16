<?php
declare(strict_types=1);

$desktopDirectory = dirname(__DIR__) . '/images/hero/desktop';
$mobileDirectory = dirname(__DIR__) . '/images/hero/mobile';
$desktopImages = glob($desktopDirectory . '/LOJA-DE-PESCA-EM-PALMAS-*.png') ?: [];

natsort($desktopImages);
$desktopImages = array_values($desktopImages);

if (!$desktopImages) {
    http_response_code(204);
    exit;
}

foreach ($desktopImages as $index => $desktopPath) {
    $filename = basename($desktopPath);
    $mobilePath = $mobileDirectory . '/' . $filename;
    $hasMobileImage = is_file($mobilePath);
    $encodedFilename = rawurlencode($filename);
    $desktopUrl = "assets/images/hero/desktop/{$encodedFilename}";
    $mobileUrl = $hasMobileImage
        ? "assets/images/hero/mobile/{$encodedFilename}"
        : $desktopUrl;
    $isActive = $index === 0;
    ?>
    <figure class="hero-slide<?= $isActive ? ' is-active' : '' ?>" aria-hidden="<?= $isActive ? 'false' : 'true' ?>">
      <picture>
        <source media="(max-width: 767px)" srcset="<?= htmlspecialchars($mobileUrl, ENT_QUOTES, 'UTF-8') ?>">
        <img src="<?= htmlspecialchars($desktopUrl, ENT_QUOTES, 'UTF-8') ?>" width="1920" height="800" alt="Banner Blue Pro Fishing <?= $index + 1 ?>" loading="<?= $isActive ? 'eager' : 'lazy' ?>" decoding="async"<?= $isActive ? ' fetchpriority="high"' : '' ?>>
      </picture>
    </figure>
    <?php
}
