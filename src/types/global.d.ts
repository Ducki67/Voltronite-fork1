interface User {
  username: string;
  accountId: string;
}

interface Tokens {
  accountId: string;
  username: string;
  token: string;
}

declare global {
  var users: User[];
  var accessTokens: Tokens[];
}

export {};
