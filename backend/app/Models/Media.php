<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Media extends BaseMedia
{
    use HasUlids, BelongsToTenant;
}