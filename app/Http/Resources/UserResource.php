<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'role'       => $this->role,
            'status'     => 'active', // can be extended with a status column
            'created_at' => $this->created_at?->toDateString(),
            'image'      => $this->image ? (filter_var($this->image, FILTER_VALIDATE_URL) ? $this->image : url('storage/' . $this->image)) : null,
        ];
    }
}
