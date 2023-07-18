<?php
namespace App\Projectors;

use App\Events\Projects\ProjectItemUpdated;
use App\Models\Projects\ProjectItem;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use App\Events\Projects\ProjectItemCreated;
use App\Events\Projects\ProjectItemDeleted;
use App\Models\Projects\Project;

class ProjectItemProjector extends Projector
{
    public function onItemCreated(ProjectItemCreated $event)
    {
        $project = Project::uuid($event->attributes['project_id'])->writeable();

        $project->items()->create($event->attributes);
    }

    public function onItemDeleted(ProjectItemDeleted $event)
    {
        $project = Project::uuid($event->attributes['project_id'])->writeable();

        $project->items()->uuid($event->attributes['id'])->delete();
    }

    public function onUpdated(ProjectItemUpdated $event)
    {
        ProjectItem::uuid($event->attributes['id'])->writeable()->update($event->attributes);
    }
}