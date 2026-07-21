@extends('layouts.app')

@section('content')
    <div class="text-center py-5">
        <h1 class="display-4 fw-bold">مرحباً بك في SportManager 🏆</h1>
        <p class="lead text-muted">الـ Layout خدام دابا بنجاح! استعمل المينيو الفوق باش تنقل بين الصفحات.</p>
        <hr class="my-4" style="width: 20%; margin: auto;">
        <div class="mt-4">
            <a href="{{ route('matchs.index') }}" class="btn btn-primary btn-lg px-4 me-2">إدارة المباريات</a>
            <a href="{{ route('matchs.classement') }}" class="btn btn-warning btn-lg px-4">جدول الترتيب</a>
        </div>
    </div>
@endsection