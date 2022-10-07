<?php

namespace App\Models\Inventory;

use App\Contracts\Inventoriable;
use App\Enums\LivestockType;
use App\Models\Image;
use App\Traits\HasInventory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Livestock extends Model implements Inventoriable
{
	use HasFactory;
	use HasInventory;

	protected $table = 'livestock';

	protected $fillable = [
		'name',
		'type',
		'breed',
		'date_of_birth',
		'location_id',
		'quantity',
		'acquired_at'
	];

	protected $casts = [
		'type' => LivestockType::class,
		'date_of_birth' => 'datetime'
	];

	protected $appends = [
		'type_description',
	];

	public function images(): MorphMany
	{
		return $this->morphMany(Image::class, 'imageable');
	}

	public function getTypeDescriptionAttribute()
	{
		return $this->type->formatted();
	}
	
}
