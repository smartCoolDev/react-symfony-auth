<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use App\Entity\{User, UserToken};
use App\Repository\{UserRepository, UserTokenRepository};
use App\DTO\{RegistrationDTO, UserDTO};
use App\Form\Type\{RegistrationType,  UserUpdatingType};
use App\Form\Util\FormHelper;
use App\Mailer\UserMailer;

class UserController
{
    /**
     * @var AuthorizationCheckerInterface
     */
    private $authorizationChecker;

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * @var RouterInterface
     */
    private $router;

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
     * @param UserPasswordEncoderInterface $encoder
     * @param RouterInterface $router
     * @param FormFactoryInterface $formFactory
     * @param UserRepository $userRepository
     * @param UserTokenRepository $tokenRepository
     * @param UserMailer $mailer
     */
    public function __construct(
        AuthorizationCheckerInterface $authorizationChecker,
        UserPasswordEncoderInterface $encoder,
        RouterInterface $router,
        FormFactoryInterface $formFactory,
        UserRepository $userRepository,
        UserTokenRepository $tokenRepository,
        UserMailer $mailer
    )
    {
        $this->authorizationChecker = $authorizationChecker;
        $this->encoder = $encoder;
        $this->router = $router;
        $this->formFactory = $formFactory;
        $this->userRepository = $userRepository;
        $this->tokenRepository = $tokenRepository;
        $this->mailer = $mailer;
    }

    /**
     * @Config\Route("/users", name="user_index")
     * @Config\Method("GET")
     * @Config\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $users = $this->userRepository->find();
        if (count($users) === 0) {
            return new JsonResponse(['message' => 'Users not found.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $response = [];
        foreach ($users as $user) {
            $response['items'][] = [
                'id' => $user->getID(),
                'name' => $user->getUsername(),
                'email' => $user->getEmail(),
                'role' => $user->getRole(),
                'status' => $user->getStatus(),
                'createdAt' => $user->getCreatedAt(DATE_ATOM),
                'updatedAt' => $user->getUpdatedAt(DATE_ATOM),
                'lastLoginAt' => $user->getLastLoginAt(DATE_ATOM),
            ];
        }

        return new JsonResponse($response);
    }

    /**
     * @Config\Route("/users", name="user_create")
     * @Config\Method("POST")
     * @Config\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $body = (array) json_decode($request->getContent(), true);
            $dto = new RegistrationDTO();
            $form = $this->formFactory->create(RegistrationType::class, $dto);
            $form->submit($body);
            if (!$form->isValid()) {
                $response = ['message' => 'Data validation failed.', 'errors' => (new FormHelper())->convertErrors($form)];

                return new JsonResponse($response, JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
            }

            $user = new User($dto->getName(), $dto->getEmail());
            $user->setPasswordHash($this->encoder->encodePassword($user, $dto->getPassword()));
            $this->userRepository->add($user);
            $token = new UserToken($user, UserToken::TYPE_ACCOUNT_ACTIVATION);
            $this->tokenRepository->add($token);

        $response = [
            'id' => $user->getID(),
            'name' => $user->getUsername(),
            'email' => $user->getEmail(),
            'role' => $user->getRole(),
            'status' => $user->getStatus(),
            'createdAt' => $user->getCreatedAt(DATE_ATOM),
            'updatedAt' => $user->getUpdatedAt(DATE_ATOM),
            'lastLoginAt' => $user->getLastLoginAt(DATE_ATOM),
        ];
        $headers = [
            'Location' => $this->router->generate('user_read', ['id' => $user->getId()], RouterInterface::ABSOLUTE_URL),
        ];

        return new JsonResponse($response, JsonResponse::HTTP_OK, $headers);
    }

    /**
     * @Config\Route("/users/{id}", name="user_read")
     * @Config\Method("GET")
     * @Config\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @param string $id
     *
     * @return JsonResponse
     */
    public function read(string $id): JsonResponse
    {
        $user = $this->userRepository->findByPK((int) $id);
        if ($user === null) {
            return new JsonResponse(['message' => 'User not found.'], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'attributes' => [
                'id' => $user->getID(),
                'email' => $user->getEmail(),
                'role' => $user->getRole(),
                'status' => $user->getStatus(),
                'name' => $user->getUsername(),
                'city' => $user->getCity(),
                'postcode' => $user->getPostCode(),
                'houseNumber' => $user->getHouseNumber(),
                'streetAddress' => $user->getStreetAddress(),
                'createdAt' => $user->getCreatedAt(DATE_ATOM),
                'updatedAt' => $user->getUpdatedAt(DATE_ATOM),
                'lastLoginAt' => $user->getLastLoginAt(DATE_ATOM),
            ],
        ]);
    }

    /**
     * @Config\Route("/users/{id}", name="user_update")
     * @Config\Method("PATCH")
     *
     * @param Request $request
     * @param string $id
     *
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = $this->userRepository->findByPK((int) $id);
        if ($user === null) {
            return new JsonResponse(['message' => 'User not found.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $body = (array) json_decode($request->getContent(), true);
        $dto = new UserDTO();
        $form = $this->formFactory->create(UserUpdatingType::class, $dto, ['currentEmail' => $user->getEmail()]);
        $form->submit($body);
        if (!$form->isValid()) {
            $response = ['message' => 'Data validation failed.', 'errors' => (new FormHelper())->convertErrors($form)];

            return new JsonResponse($response, JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user->setEmail($dto->getEmail());
        $user->setName($dto->getName());
        $user->setCity($dto->getCity());
        $user->setHouseNumber($dto->getHouseNumber());
        $user->setStreetAddress($dto->getStreetAddress());
        $user->setPostcode($dto->getPostCode());
        if ($dto->getPassword() !== null) {
            $user->setPasswordHash($this->encoder->encodePassword($user, $dto->getPassword()));
        }
        $this->userRepository->save($user);

        return new JsonResponse([
            'attributes' => [
                'id' => $user->getID(),
                'name' => $user->getUsername(),
                'email' => $user->getEmail(),
                'city' => $user->getCity(),
                'postcode' => $user->getPostCode(),
                'houseNumber' => $user->getHouseNumber(),
                'streetAddress' => $user->getStreetAddress(),
                'createdAt' => $user->getCreatedAt(DATE_ATOM),
                'updatedAt' => $user->getUpdatedAt(DATE_ATOM),
                'lastLoginAt' => $user->getLastLoginAt(DATE_ATOM),
            ],
        ]);
    }
}
