<?php

namespace App\Models;

use App\Models\Inventory\Livestock;
use App\Models\Inventory\Seed;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Location extends Model
{
	use HasUlids, HasFactory, BelongsToTenant;

	protected $table = 'locations';

	protected $fillable = [
		'tenant_id',
		'primary',
		'name',
		'description',
		'address1',
		'address2',
		'city',
		'state',
		'zip',
		'country'
	];

	protected $casts = [
		'primary' => 'boolean'
	];

	public function livestock(): BelongsTo
	{
		return $this->belongsTo(Livestock::class, 'id', 'location_id');
	}

	public function seeds(): BelongsTo
	{
		return $this->belongsTo(Seed::class, 'id', 'location_id');
	}

}
