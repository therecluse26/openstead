<?php
use App\Services\RouteBuilderService;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Inventory\PantryController;

RouteBuilderService::buildTypeFilterRoute(PantryController::class);
Route::get('/filters', [PantryController::class, 'getFilters']);
Route::get('/{id}/similar', [PantryController::class, 'getSimilar']);

Route::prefix('')->name('pantry.')->group(static function () {
    Route::get('/', [PantryController::class, 'index']);
    Route::post('/', [PantryController::class, 'store']);
    Route::put('/{id}', [PantryController::class, 'update']);
    Route::get('/{id}', [PantryController::class, 'show']);
    Route::delete('/{id}', [PantryController::class, 'destroy']);
});