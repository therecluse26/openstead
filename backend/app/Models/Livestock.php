<?php

namespace App\Models;

use App\Contracts\Inventoriable;
use App\Enums\LivestockType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Livestock extends Model implements Inventoriable
{
	use HasFactory;

	protected $table = 'livestock';

	protected $fillable = [
		'name',
		'type',
		'breed',
		'date_of_birth',
	];

	protected $casts = [
		'type' => LivestockType::class
	];

	protected $appends = [
		'type_description'
	];

	public function inventory(): MorphMany
	{
		return $this->morphMany(LocationInventory::class, 'inventoriable');
	}

	public function images(): MorphMany
	{
		return $this->morphMany(Image::class, 'imageable');
	}

	public function getTypeDescriptionAttribute()
	{
		return $this->type->formatted();
	}
}
