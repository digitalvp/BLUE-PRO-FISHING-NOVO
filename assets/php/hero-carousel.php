<?php
declare(strict_types=1);

$desktopDirectory = dirname(__DIR__) . '/images/hero/desktop';
$mobileDirectory = dirname(__DIR__) . '/images/hero/mobile';
$allowedExtensions = ['webp', 'jpg', 'jpeg', 'png'];
$desktopImages = glob($desktopDirectory . '/*') ?: [];

$desktopImages = array_values(array_filter($desktopImages, static function (string $path) use ($allowedExtensions): bool {
    $filename = basename($path);
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    return is_file($path)
        && $filename[0] !== '.'
        && in_array($extension, $allowedExtensions, true)
        && @getimagesize($path) !== false;
}));

natsort($desktopImages);
$desktopImages = array_values($desktopImages);

if (!$desktopImages) {
    http_response_code(204);
    exit;
}

foreach ($desktopImages as $index => $desktopPath) {
    $filename = basename($desktopPath);
    $desktopSize = getimagesize($desktopPath);
    if ($desktopSize === false) {
        continue;
    }

    $mobilePath = $mobileDirectory . '/' . $filename;
    $mobileSize = is_file($mobilePath)
        && in_array(strtolower(pathinfo($mobilePath, PATHINFO_EXTENSION)), $allowedExtensions, true)
        ? @getimagesize($mobilePath)
        : false;
    $hasMobileImage = is_array($mobileSize);
    $encodedFilename = rawurlencode($filename);
    $desktopVersion = (string) filemtime($desktopPath);
    $mobileVersion = $hasMobileImage ? (string) filemtime($mobilePath) : $desktopVersion;
    $mobileUrl = $hasMobileImage
        ? "assets/images/hero/mobile/{$encodedFilename}?v={$mobileVersion}"
        : "assets/images/hero/desktop/{$encodedFilename}?v={$desktopVersion}";
    $desktopUrl = "assets/images/hero/desktop/{$encodedFilename}?v={$desktopVersion}";
    $isActive = $index === 0;
    ?>
    <figure class="hero-slide<?= $isActive ? ' is-active' : '' ?>" aria-hidden="<?= $isActive ? 'false' : 'true' ?>">
      <picture>
        <source media="(max-width: 767px)" srcset="<?= htmlspecialchars($mobileUrl, ENT_QUOTES, 'UTF-8') ?>"<?= $mobileSize ? ' width="' . (int) $mobileSize[0] . '" height="' . (int) $mobileSize[1] . '"' : '' ?>>
        <img src="<?= htmlspecialchars($desktopUrl, ENT_QUOTES, 'UTF-8') ?>" width="<?= (int) $desktopSize[0] ?>" height="<?= (int) $desktopSize[1] ?>" alt="Banner Blue Pro Fishing <?= $index + 1 ?>" loading="<?= $isActive ? 'eager' : 'lazy' ?>" decoding="async"<?= $isActive ? ' fetchpriority="high"' : '' ?>>
      </picture>
    </figure>
    <?php
}
