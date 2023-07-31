<?php

namespace App\Controller;

use DateTimeImmutable;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use Ramsey\Uuid\Uuid;
use App\Entity\{User, UserToken};
use App\Repository\{UserRepository, UserTokenRepository};
use App\Form\Util\FormHelper;
use App\Mailer\UserMailer;

class UserTokenController
{
    /**
     * @var AuthorizationCheckerInterface
     */
    private $authorizationChecker;

    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * @var FormFactoryInterface
     */
    private $formFactory;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @var UserTokenRepository
     */
    private $tokenRepository;

    /**
     * @var UserMailer
     */
    private $mailer;

    /**
     * @param AuthorizationCheckerInterface $authorizationChecker
     * @param TokenStorageInterface $tokenStorage
     * @param UserPasswordEncoderInterface $encoder
     * @param FormFactoryInterface $formFactory
     * @param UserRepository $userRepository
     * @param UserTokenRepository $tokenRepository
     * @param UserMailer $mailer
     */
    public function __construct(
        AuthorizationCheckerInterface $authorizationChecker,
        TokenStorageInterface $tokenStorage,
        UserPasswordEncoderInterface $encoder,
        FormFactoryInterface $formFactory,
        UserRepository $userRepository,
        UserTokenRepository $tokenRepository,
        UserMailer $mailer
    )
    {
        $this->authorizationChecker = $authorizationChecker;
        $this->tokenStorage = $tokenStorage;
        $this->encoder = $encoder;
        $this->formFactory = $formFactory;
        $this->userRepository = $userRepository;
        $this->tokenRepository = $tokenRepository;
        $this->mailer = $mailer;
    }


    /**
     * @Config\Route("/user-tokens/{token}", name="user_token_read")
     * @Config\Method("GET")
     * @Config\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @param string $token
     *
     * @return JsonResponse
     */
    public function read(string $token): JsonResponse
    {
        if (!Uuid::isValid($token) || ($token = $this->tokenRepository->findByPK($token)) === null) {
            return new JsonResponse(['message' => 'Token not found.'], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'attributes' => [
                'uuid' => $token->getUUID(),
                'user_id' => $token->getUserID(),
                'type' => $token->getType(),
                'comment' => $token->getComment(),
                'createdAt' => $token->getCreatedAt(DATE_ATOM),
                'usedAt' => $token->getUsedAt(DATE_ATOM),
                'isExpired' => $token->isExpired(),
            ],
        ]);
    }
}
