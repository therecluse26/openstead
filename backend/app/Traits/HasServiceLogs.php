<?php

namespace App\Traits;

use App\Models\ServiceLog;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasServiceLogs
{
	public function serviceLogs(): MorphMany
	{
		return $this->morphMany(ServiceLog::class, 'serviceable');
	}
}