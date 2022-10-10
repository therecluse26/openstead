<?php

namespace App\Models\Inventory;

use App\Contracts\Inventoriable;
use App\Contracts\VarietyContract;
use App\Models\Image;
use App\Traits\HasInventory;
use App\Traits\HasVariety;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Seed extends Model implements Inventoriable, VarietyContract
{
	use HasFactory;
	use HasInventory;
	use HasVariety;

	protected $table = 'seeds';

	protected $fillable = [
		'type',
		'variety_id',
		'location_id',
		'quantity',
		'acquired_at'
	];

	protected $casts = [
		'acquired_at' => 'datetime'
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
