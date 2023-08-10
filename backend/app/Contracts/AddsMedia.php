<?php
namespace App\Contracts;
use Spatie\MediaLibrary\MediaCollections\FileAdder;
use Illuminate\Support\Collection;
use Spatie\MediaLibrary\HasMedia;

interface AddsMedia {
    public function addMediaFromRequest(string $key): FileAdder;
    
    public function addMultipleMediaFromRequest(array $keys): Collection;

    public function addAllMediaFromRequest(): Collection;

    public function addMediaFromDisk(string $key, string $disk = null): FileAdder;

    public function addMediaFromUrl(string $url, array|string ...$allowedMimeTypes): FileAdder;

    public function addMediaFromString(string $text): FileAdder;

    public function addMediaFromBase64(string $base64data, array|string ...$allowedMimeTypes): FileAdder;
    
    public function addMediaFromStream($stream): FileAdder;

    public function clearMediaCollection(string $collectionName = 'default'): HasMedia;
}