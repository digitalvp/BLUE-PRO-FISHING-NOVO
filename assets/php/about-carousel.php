<?php
declare(strict_types=1);

$imageDirectory = dirname(__DIR__) . '/img/sobre';
$extensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
$images = glob($imageDirectory . '/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', GLOB_BRACE) ?: [];
$images = array_values(array_filter($images, static function (string $image) use ($extensions): bool {
    return in_array(strtolower(pathinfo($image, PATHINFO_EXTENSION)), $extensions, true);
}));
natsort($images);
$images = array_slice(array_values($images), 0, 9);

if (!$images) {
    http_response_code(204);
    exit;
}
?>
<div class="about-carousel" data-carousel aria-label="Galeria de fotos da Blue Pro Fishing">
  <div class="about-carousel-track">
    <?php foreach ($images as $index => $image): ?>
      <?php $imageName = basename($image); ?>
      <figure class="about-carousel-slide<?= $index === 0 ? ' is-active' : '' ?>" aria-hidden="<?= $index === 0 ? 'false' : 'true' ?>">
        <img src="assets/img/sobre/<?= rawurlencode($imageName) ?>" alt="Blue Pro Fishing — foto <?= $index + 1 ?>" loading="<?= $index === 0 ? 'eager' : 'lazy' ?>" decoding="async">
      </figure>
    <?php endforeach; ?>
  </div>
  <?php if (count($images) > 1): ?>
    <button class="about-carousel-control about-carousel-control-prev" type="button" data-carousel-prev aria-label="Foto anterior">&#10094;</button>
    <button class="about-carousel-control about-carousel-control-next" type="button" data-carousel-next aria-label="Próxima foto">&#10095;</button>
    <div class="about-carousel-dots" role="tablist" aria-label="Selecionar foto">
      <?php foreach ($images as $index => $image): ?>
        <button class="about-carousel-dot<?= $index === 0 ? ' is-active' : '' ?>" type="button" data-carousel-dot="<?= $index ?>" role="tab" aria-label="Ver foto <?= $index + 1 ?>" aria-selected="<?= $index === 0 ? 'true' : 'false' ?>"></button>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</div>
