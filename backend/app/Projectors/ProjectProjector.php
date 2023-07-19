<?php
namespace App\Projectors;

use App\Events\Projects\ProjectCreated;
use App\Events\Projects\ProjectDeleted;
use App\Events\Projects\ProjectUpdated;
use App\Models\Projects\Project;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;

class ProjectProjector extends Projector
{
    public function onCreated(ProjectCreated $event)
    {
        (new Project($event->attributes))->writeable()->save();
    }

    public function onUpdated(ProjectUpdated $event)
    {
        Project::find($event->attributes['id'])->writeable()->update($event->attributes);
    }

    public function onDeleted(ProjectDeleted $event)
    {
        Project::find($event->attributes['id'])->writeable()->delete();
    }
}