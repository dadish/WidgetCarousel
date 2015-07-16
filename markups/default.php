<?php
$page = wire('page');
$list = ($renderPages->count()) ? $renderPages : $renderPages->append($page);

$imgsStr = "<ul class='slide-ul' data-animationType='$settings->animation_type' data-speed='$settings->speed' data-interval='$settings->interval'>";
$i = 0;

$imgs = new PageImages($page);
foreach ($list as $p) {
  $p->of(false);
  $imgField = $p->get($settings->image_field);
  if ($imgField instanceof PageImages && $imgField->count()) {
    if ($settings->include_text && !$settings->single_text) {
      foreach ($imgField->shuffle()->filter("limit=$settings->image_count") as $img) {
        $img->text = ($settings->text_from_description) ? $img->description : $p->get($settings->text_field);
        $imgs->append($img);
      }
    } else {
      $imgs->import($imgField->filter("limit=$settings->image_count"));
    }
  }
  $p->of(true);
}

if (!$imgs->count()) {
  if ($settings->include_text && $settings->single_text){
    $text = $renderPages->first()->get($settings->text_field);
    echo "<h1 class='slide--title slide-title--lonely'>$text</h1>";
  }
  return '';
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

  if ($settings->include_text && !$settings->single_text) {
    $text = "<div class='slide-li--title'><h1 class='slide--title'>$img->text</h1></div>";
  } else {
    $text = "";
  }

  $active = $i === 0 ? 'slide-li--a' : '';
  $hash = substr(md5($img->name), 0, 6);
  $imgsStr .= "<li class='slide-li $active' data-id='$p->id-$hash'><img class='slide-img' src='$imgSrc' alt='$img->description'/>$text</li>";
  $i++;
}

if ($settings->include_text && $settings->single_text) {
  $text = $renderPages->first()->get($settings->text_field);
  $imgsStr .= "<li class='slide-ul--title'><h1 class='slide--title'>$text</h1></li>";
}

$imgsStr .= "<li class='slide-li--next'><i class='icon-right'></i></li>";
$imgsStr .= "<li class='slide-li--prev'><i class='icon-left'></i></li>";
$imgsStr .= "</ul>";

echo $imgsStr;