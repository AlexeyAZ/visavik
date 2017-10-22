<?php
$sendto = "office@visavik.com, airat-visavik@yandex.ru";
$phone = nl2br($_POST['phone']);
$name = nl2br($_POST['name']);
$email = nl2br($_POST['email']);
$place = nl2br($_POST['place']);
$time = nl2br($_POST['time']);
$content = "Заявка с сайта Visavik";

// Формирование заголовка письма
$subject  = $content;
$headers  = "From: no-reply@no-reply.ru" . "\r\n";
$headers .= "Reply-To: Без ответа". "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html;charset=utf-8 \r\n";

// Формирование тела письма
$msg  = "<html><body style='font-family:Arial,sans-serif;'5>";
$msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>Письмо с сайта Visavik";
$msg .= "</h2>\r\n";
$msg .= "<p><strong>Телефон:</strong> ".$phone."</p>\r\n";
$msg .= "<p><strong>ФИО:</strong> ".$name."</p>\r\n";
$msg .= "<p><strong>E-mail:</strong> ".$email."</p>\r\n";
$msg .= "<p><strong>Куда летим:</strong> ".$place."</p>\r\n";
$msg .= "<p><strong>Когда летим:</strong> ".$time."</p>\r\n";
$msg .= "</body></html>";
mail($sendto, $subject, $msg, $headers);
?>