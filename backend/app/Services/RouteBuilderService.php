<?php

namespace App\Services;

use Illuminate\Support\Facades\Route;
use RuntimeException;
use Symfony\Component\VarExporter\Exception\ClassNotFoundException;

class RouteBuilderService
{
	/**
	 * Builds routes for AppendableSelect component based on given class
	 *
	 * Any $controllerClass passed into this should implement the
	 * `HasAppendableSelect` interface
	 *
	 * @throws ClassNotFoundException
	 */
	public static function buildTypeFilterRoute(string $controllerClass): void
	{
		if (!class_exists($controllerClass)) {
			throw new ClassNotFoundException("Controller class $controllerClass does not exist");
		}
		if (isset(class_implements($controllerClass)['HasAppendableSelect'])) {
			throw new RuntimeException("Controller class $controllerClass must implement HasAppendableSelect contract");
		}
		Route::prefix('/types')
			->group(function () use ($controllerClass) {
				Route::get('/', [$controllerClass, 'getTypes']);
				Route::post('/', [$controllerClass, 'storeTypeValue']);
				Route::get('/{type}/values', [$controllerClass, 'getTypeValues']);
			});

	}
}