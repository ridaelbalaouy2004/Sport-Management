<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserApiController extends Controller
{
    /**
     * GET /api/users  (admin only)
     * Supports filtering: ?role=admin&name=...
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        return UserResource::collection($query->latest()->get());
    }

    /**
     * POST /api/users  — admin creates a user with a specific role
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,manager,viewer',
            'image'    => 'nullable|url|max:2048',
        ]);

        $data = [
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
            'image'    => $validated['image'] ?? null,
        ];

        $user = User::create($data);

        return new UserResource($user);
    }

    /**
     * GET /api/users/{user}
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * PUT /api/users/{user}
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6',
            'role'     => 'sometimes|in:admin,manager,viewer',
            'image'    => 'nullable|url|max:2048',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        return new UserResource($user);
    }

    /**
     * DELETE /api/users/{user}
     */
    public function destroy(User $user)
    {
        // Prevent self-deletion
        if ($user->id === request()->user()->id) {
            return response()->json(['message' => 'Cannot delete your own account.'], 403);
        }

        $user->delete();
        return response()->json(null, 204);
    }
}
