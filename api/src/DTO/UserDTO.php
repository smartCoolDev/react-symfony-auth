<?php

namespace App\DTO;

class UserDTO
{
    /**
     * @var string|null
     */
    private $name;
    
    /**
     * @var string|null
     */
    private $email;

    /**
     * @var string|null
     */
    private $password;

    /**
     * @var int|null
     */
    private $role;

    /**
     * @var int|null
     */
    private $status;
    
    /**
     * @var string|null
     */
    private $postcode = '';
    
    /**
     * @var string|null
     */
    private $city = '';
    
    /**
     * @var string|null
     */
    private $houseNumber = '';
    
    /**
     * @var string|null
     */
    private $streetAddress = '';

        /**
     * @param string $name
     */
    public function setName(string $name)
    {
        $this->name = $name;
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email)
    {
        $this->email = $email;
    }

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }
    
    /**
     * @param string|null $postcode
     */
    public function setPostCode(?string $postcode)
    {
        $this->postcode = $postcode !== null ? (string) $postcode : null;

    }
    /**
     * @return string|null
     */
    public function getPostCode(): ?string
    {
        return $this->postcode;

    }
   
    /**
     * @param string|null $streetAddress
     */
    public function setStreetAddress(?string $streetAddress)
    {
        $this->streetAddress = $streetAddress !== null ? (string) $streetAddress : null;

    }
    /**
     * @return string|null
     */
    public function getStreetAddress(): ?string
    {
        return $this->streetAddress;
    }
 
    /**
     * @param string|null $houseNumber
     */
     public function setHouseNumber(?string $houseNumber): void
    {
        $this->houseNumber = $houseNumber !== null ? $houseNumber : '';
    }
    /**
     * @return string|null
     */
    public function getHouseNumber(): ?string
    {
        return $this->houseNumber;
    }

    /**
     * @param string|null $city
     */
    public function setCity(?string $city)
    {
        $this->city = $city !== null ? (string) $city : null;
    }

    /**
     * @return string|null
     */
    public function getCity(): ?string
    {
        return $this->city;
    }

    
    /**
     * @param string $password
     */
    public function setPassword(string $password)
    {
        $this->password = $password;
    }

    /**
     * @return string|null
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    /**
     * @param int $role
     */
    public function setRole(int $role)
    {
        $this->role = $role;
    }

    /**
     * @return int|null
     */
    public function getRole(): ?int
    {
        return $this->role;
    }

    /**
     * @param int $status
     */
    public function setStatus(int $status)
    {
        $this->status = $status;
    }

    /**
     * @return int|null
     */
    public function getStatus(): ?int
    {
        return $this->status;
    }
}
