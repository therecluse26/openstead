<?php
namespace App\Helpers;

class StringHelpers {
    public static function sanitizeHtml($string, $allowedTags = '<p><strong><em><u><h1><h2><h3><h4><h5><h6><img><li><ol><ul><span><div><br><ins><del><img><a><blockquote><code><pre><table><thead><tbody><tr><th><td><hr>'){
        return strip_tags(stripslashes($string),$allowedTags);
    }
}
