<?php

namespace App\Mail;

use App\Models\MatchModel;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MatchCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public MatchModel $match)
    {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $home = $this->match->equipeDomicile?->nom ?? 'Team A';
        $away = $this->match->equipeExterieur?->nom ?? 'Team B';

        return new Envelope(
            subject: "⚽ New Match Scheduled: {$home} vs {$away}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.match-created',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
