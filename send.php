<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Метод не поддерживается']);
    exit;
}

$name       = trim(strip_tags($_POST['name'] ?? 'Не указано'));
$phone      = trim(strip_tags($_POST['phone'] ?? ''));
$comment    = trim(strip_tags($_POST['comment'] ?? 'Без комментария'));
$sourceInfo = trim(strip_tags($_POST['source_info'] ?? 'Не определено'));
$page       = trim(strip_tags($_POST['page'] ?? ''));

if (empty($phone)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Не указан телефон']);
    exit;
}

$to      = 'info@terraterm.ru';
$subject = 'Новая заявка с сайта ТЕРРАТЕРМ от ' . $name;

$textBody  = "Поступила новая заявка с сайта ТЕРРАТЕРМ:\n\n";
$textBody .= "Имя: " . $name . "\n";
$textBody .= "Телефон: " . $phone . "\n";
$textBody .= "Комментарий клиента: " . $comment . "\n";
$textBody .= "----------------------------------------\n";
$textBody .= "Источник заявки: " . $sourceInfo . "\n";
$textBody .= "Ссылка на страницу: " . $page . "\n";
$textBody .= "Дата и время: " . date('d.m.Y H:i') . "\n";

$boundary = md5(uniqid(time()));
$headers  = "From: Заявки ТЕРРАТЕРМ <noreply@terraterm.ru>\r\n";
$headers .= "Reply-To: info@terraterm.ru\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

$body  = "--{$boundary}\r\n";
$body .= "Content-Type: text/plain; charset=utf-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= $textBody . "\r\n\r\n";


if (!empty($_FILES['attachments']['name'])) {
    $fileCount = count($_FILES['attachments']['name']);
    for ($i = 0; $i < $fileCount; $i++) {
        if ($_FILES['attachments']['error'][$i] === UPLOAD_ERR_OK) {
            $tmpName  = $_FILES['attachments']['tmp_name'][$i];
            $fileName = basename($_FILES['attachments']['name'][$i]);
            $fileType = $_FILES['attachments']['type'][$i] ?: 'application/octet-stream';
            $fileData = chunk_split(base64_encode(file_get_contents($tmpName)));

            $encodedName = '=?UTF-8?B?' . base64_encode($fileName) . '?=';

            $body .= "--{$boundary}\r\n";
            $body .= "Content-Type: {$fileType}; name=\"{$encodedName}\"\r\n";
            $body .= "Content-Disposition: attachment; filename=\"{$encodedName}\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= $fileData . "\r\n";
        }
    }
}

$body .= "--{$boundary}--";

if (mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers)) {
    echo json_encode(['status' => 'ok']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Ошибка почтового сервера']);
}