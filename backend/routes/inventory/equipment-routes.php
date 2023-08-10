<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Inventory\EquipmentController;

Route::get('/types', [EquipmentController::class, 'getTypes']);
Route::get('/filters', [EquipmentController::class, 'getFilters']);
Route::get('/{id}/similar', [EquipmentController::class, 'getSimilar']);

Route::prefix('')->name('equipment.')->group(static function () {
    Route::get('/', [EquipmentController::class, 'index']);
    Route::post('/', [EquipmentController::class, 'store']);
    Route::get('/{id}', [EquipmentController::class, 'show']);
    Route::put('/{id}', [EquipmentController::class, 'update']);
    Route::delete('/{id}', [EquipmentController::class, 'destroy']);
});