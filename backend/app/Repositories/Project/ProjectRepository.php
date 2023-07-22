<?php
namespace App\Repositories\Project;

use App\Contracts\Repository;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ProjectRepository implements Repository
{
    protected Project $model;
    
    public function __construct()
    {
        $this->model = new Project();
    }

    public function __call(string $method, array $arguments): mixed
    {
        return $this->model->$method(...$arguments);
    }

    public function count(): int
    {
        return $this->model->count();
    }

    public function getModel(): Model
    {
        return $this->model;
    }

    public function all(): Collection
    {
        return $this->model->all();
    }

    public function getById($id): Model
    {
        return $this->model->find($id);
    }
    
    public function getBySlug($slug): Model
    {
        return $this->model->where('slug', $slug)->first();
    }

    public function create(array $attributes)
    {
        $this->model->eventCreate($attributes);
        return $this->model->where('slug', $attributes['slug'])->first();
    }
    
    public function update($id, array $attributes)
    {
        return $this->model->find($id)->eventUpdate($attributes);
    }

    /**
     * Update project items en masse
     *
     * @param Project $project
     * @param array $attributes
     * @return void
     */
    public function updateItems(Project $project, array $attributes)
    {
        $itemsChanged = collect();

        $project->items()->get()->map(function ($item) use ($attributes, $itemsChanged) {
            foreach ($attributes['items'] as $itemUpdate) {
                $changed = false;
                if ($item->id === $itemUpdate['id']) {

                    // Check if item has been updated
                    foreach($item->attributesToArray() as $key => $value) {
                        if (isset($itemUpdate[$key]) && $itemUpdate[$key] !== $value) {
                            $changed = true;
                            $itemsChanged->push($item);
                        }
                    }

                    if ($changed){
                        $item->eventUpdate($itemUpdate);
                    }
                }
            }
        });
        return $itemsChanged;
    }

    public function delete($id)
    {
        return $this->model->find($id)->eventDelete();
    }
   
}