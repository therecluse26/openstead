<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Model;

interface Repository
{
	public function getModel(): Model|Inventoriable;

}