<?php
$page = wire('page');
$pages = wire('pages');
$input = wire('input');
$galleryRender = get_home_page()->get("template=gallery-render");
$gallery = $pages->get("template=gallery-list");
$album = $input->urlSegment1;
if ($album) $album = $pages->get("parent=$gallery, template=gallery-item, name=$album");

$list = $renderPages->import($gallery->children((!$album || $album instanceof NullPage) ? "" : "id=$album"));
$classes = $settings->animation_type === 'fade' ? 'slide-ul slide-ul--black' : 'slide-ul';

$imgsStr = "<ul class='$classes' data-animationType='$settings->animation_type' data-speed='$settings->speed' data-interval='$settings->interval'>";
$i = 0;

$imgs = new Pageimages($page);
foreach ($list as $p) {
  $p->of(false);
  $imgField = $p->get($settings->image_field);
  if ($imgField instanceof Pageimages && $imgField->count()) {
    $imgField = $imgField->makeCopy();
    $imgs->import($imgField->shuffle()->filter("limit=$settings->image_count"));  
  }
  $p->of(true);
}

foreach ($imgs as $img) {
  if ($settings->image_thumbnail) {
    $imgSrc = $img->getThumb($settings->image_thumbnail);
  } else {
    $width = $settings->image_width;
    $height = $settings->image_height;
    if ($width && $height) $thumb = $img->size($width, $height);
    else if ($width && !$height) $thumb = $img->width($width);
    else if (!$width && $height) $thumb = $img->height($height);
    else $thumb = $img;
    $imgSrc = $thumb->url;
  }

  $active = $i === 0 ? 'slide-li--a' : '';
  $hash = substr(md5($img->name), 0, 6);
  $imgsStr .= "<li class='slide-li $active' data-id='$p->id-$hash'><img class='slide-img' src='$imgSrc' alt='$img->description'/></li>";
  $i++;
}

$imgsStr .= "<li class='slide-ul--title'><h1 class='slide--title'><a class='gallery-carousel-a' href='$galleryRender->url'>$galleryRender->title</a></h1></li>";

$imgsStr .= "<li class='slide-li--next'><i class='icon-right'></i></li>";
$imgsStr .= "<li class='slide-li--prev'><i class='icon-left'></i></li>";
$imgsStr .= "</ul>";

if ($page->id === $galleryRender->id) return '';

echo $imgsStr;