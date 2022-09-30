import { generateToken } from '../utils/jwtHelper.js';
import { userRepository } from '../repository/user.js';
import { emailSender } from '../utils/emailTransporter.js';

const createAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, userName } = req.body;

    // Fetch user information from Redis
    const existingUser = await userRepository
      .search()
      .where('email')
      .equals(email.toLowerCase())
      .or('userName')
      .equals(userName)
      .returnFirst();

    // Check if user with that email or username already exists
    if (existingUser) {
      return res.status(409).send({
        error: true,
        message: 'Account with that email or username already exists',
        data: '',
      });
    }

    // Create user account and send notification
    const user = await userRepository.createAndSave({
      firstName,
      lastName,
      email: email.toLowerCase(),
      userName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Generate token for the user
    const token = await generateToken({ email });

    // Send a welcome email to user with a login link
    emailSender(email, firstName, token);

    if (user) {
      return res.status(201).send({
        error: false,
        message:
          'Account succesfully created. Please check your email to continue.',
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: `Server error, please try again later. ${error}`,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, userName } = req.body;

    let user;
    // Get the user details from Redis
    if (email) {
      user = await userRepository
        .search()
        .where('email')
        .equals(email.toLowerCase())
        .returnFirst();
    } else if (userName) {
      user = await userRepository
        .search()
        .where('userName')
        .equals(userName)
        .returnFirst();
    }

    if (!user) {
      return res.status(404).send({
        error: true,
        message: 'User not found',
      });
    }

    // Generate a token for the user to perform other operations
    const token = await generateToken({ email: user.email });

    // Send authentication credentials to user email
    emailSender(user.email, user.firstName, token);

    return res.status(200).send({
      error: false,
      message: 'Kindly check your email to continue',
    });
  } catch (error) {
    return `Server error, please try again later. ${error}`;
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email } = req.validatedToken;

    // Get the user details from Redis
    const user = await userRepository
      .search()
      .where('email')
      .eq(email.toLowerCase())
      .returnFirst();

    if (!user) {
      return res.status(404).send({
        error: true,
        message: 'User not found',
      });
    }

    return res.status(200).send({
      error: false,
      message: 'User authenticated',
      data: user,
    });
  } catch (error) {
    return `Server error, please try again later. ${error}`;
  }
};

export { createAccount, login, verifyUser };
