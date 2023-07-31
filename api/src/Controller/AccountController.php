<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Form\Util\FormHelper;

class AccountController
{
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
     * @param TokenStorageInterface $tokenStorage
     * @param UserPasswordEncoderInterface $encoder
     * @param FormFactoryInterface $formFactory
     * @param UserRepository $userRepository
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        UserPasswordEncoderInterface $encoder,
        FormFactoryInterface $formFactory,
        UserRepository $userRepository
    )
    {
        $this->tokenStorage = $tokenStorage;
        $this->encoder = $encoder;
        $this->formFactory = $formFactory;
        $this->userRepository = $userRepository;
    }

    /**
     * @Config\Route("/account", name="account_index")
     * @Config\Method("GET")
     * @Config\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $user = $this->tokenStorage->getToken()->getUser();

        return new JsonResponse([
            'attributes' => [
                'id' => $user->getID(),
                'email' => $user->getEmail(),
                'role' => $user->getRole(),
                'status' => $user->getStatus(),
                'createdAt' => $user->getCreatedAt(DATE_ATOM),
                'updatedAt' => $user->getUpdatedAt(DATE_ATOM),
                'lastLoginAt' => $user->getLastLoginAt(DATE_ATOM),
            ],
        ]);
    }
}
