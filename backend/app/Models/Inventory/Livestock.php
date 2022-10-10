<?php

namespace App\Models\Inventory;

use App\Contracts\Inventoriable;
use App\Contracts\VarietyContract;
use App\Enums\LivestockType;
use App\Models\Image;
use App\Traits\HasInventory;
use App\Traits\HasVariety;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Livestock extends Model implements Inventoriable, VarietyContract
{
	use HasFactory;
	use HasInventory;
	use HasVariety;

	protected $table = 'livestock';

	protected $fillable = [
		'name',
		'type',
		'variety_id',
		'date_of_birth',
		'location_id',
		'quantity',
		'acquired_at'
	];

	protected $casts = [
		'type' => LivestockType::class,
		'date_of_birth' => 'datetime',
		'acquired_at' => 'datetime'
	];

	protected $appends = [
		'type_description',
		'breed'
	];
	
	public function images(): MorphMany
	{
		return $this->morphMany(Image::class, 'imageable');
	}

	public function breed(): Attribute
	{
		return Attribute::make(
			get: fn() => $this->variety?->name ?? null
		);
	}

	public function getTypeDescriptionAttribute()
	{
		return $this->type?->formatted();
	}

}
