<?php

namespace App\Http\Controllers\Api\Admin;

use Illuminate\Http\Request;
use App\Http\Requests\MediaRequest;
use App\Http\Controllers\Api\ApiController;

class MediaController extends ApiController
{
    protected $apiProvider = 'users';

    public function  __construct()
    {
        parent::__construct();
    }

    public function uploadImage(MediaRequest $request)
    {
        try {
            $folder = str_slug($request->folder ?: '');
            $prefix_path = 'uploads/' . join('/', explode('-', $folder));
    
            $request->file('image')->hashName();

            $path = $request->file('image')->store($prefix_path, 'uploads');

            return $this->response(['path' => $path]);            
        } catch (\Exception $e) {
            return $this->response(['error' => $e->getMessage() ], 400);
        }
    }

    public function deleteImage(Request $request) 
    {
        
    }
}
