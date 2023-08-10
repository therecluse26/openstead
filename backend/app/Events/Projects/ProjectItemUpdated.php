<?php
namespace App\Events\Projects;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class ProjectItemUpdated extends ShouldBeStored
{
    /** @var array */
    public $attributes;

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }
}