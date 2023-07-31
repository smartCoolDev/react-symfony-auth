<?php

namespace App\Mailer;

use Swift_Mailer;
use Swift_Message;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use App\Entity\{User, UserToken};

class UserMailer
{
    /**
     * @var Swift_Mailer
    */
    private $mailer;

    /**
     * @var EngineInterface
     */
    private $engine;

    /**
     * @var array
     */
    private $parameters;

    /**
     * @param Swift_Mailer $mailer
     * @param EngineInterface $engine
     * @param array $parameters
     */
    public function __construct(Swift_Mailer $mailer, EngineInterface $engine, array $parameters)
    {
        $this->mailer = $mailer;
        $this->engine = $engine;
        $this->parameters = $parameters;
    }

    /**
     * @param string $subject
     * @param array|string $recipientEmail
     * @param string $htmlTemplate
     * @param string $txtTemplate
     */
    private function sendMessage(string $subject, $recipientEmail, string $htmlTemplate, string $txtTemplate)
    {
        $message = (new Swift_Message())
            ->setSubject($subject)
            ->setFrom([$this->parameters['sender_email']['address'] => $this->parameters['sender_email']['name']])
            ->setTo($recipientEmail)
            ->setBody($htmlTemplate, 'text/html')
            ->addPart($txtTemplate, 'text/plain');

        $this->mailer->send($message);
    }
}
