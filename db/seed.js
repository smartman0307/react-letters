// @flow

import { join } from 'path';
import { name, internet, lorem, date, random } from 'faker';
import { promisify } from 'bluebird';
import mkdirp from 'mkdirp';
import { sample, sampleSize, random as rand } from 'lodash';
import { v4 as uuid } from 'node-uuid';
import { writeFile } from 'fs';
import { categories } from './constants';
import ora from 'ora';

const write = promisify(writeFile);

function generateProfilePicture() {
  const pics = [];
  for (let i = 0; i < 15; i++) {
    pics.push(`https://cdn.learnreactjs.io/assets/profile-pictures/${i + 1}.png`);
  }
  return function selectRandomProfilePicture() {
    return sample(pics);
  };
}
const createProfilePicture = generateProfilePicture();


function generateShareablePicture() {
  const pics = [];
  for (let i = 0; i < 50; i++) {
    pics.push(`https://cdn.learnreactjs.io/assets/post-images/${i + 1}.jpg`);
  }
  return function selectRandomPostImage() {
    return sample(pics);
  };
}
const createShareableImage = generateShareablePicture();

class User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  profilePicture: string;
  constructor() {
    this.email = internet.email();
    this.firstName = name.firstName();
    this.id = uuid();
    this.profilePicture = createProfilePicture();
    this.lastName = name.lastName();
    this.password = internet.password();
    this.username = internet.userName();
  }
}

// possible categories

function returnCategories() {
  return sampleSize(categories, rand(1, 15));
}
class Post {
  comments: Array<Comment>;
  content: string;
  date: Date;
  id: string;
  image: ?string;
  link: ?Object;
  user: ?Object;
  likes: number;
  categories: Array<string>;
  constructor(user) {
    this.id = uuid();
    this.categories = returnCategories();
    this.comments = [];
    this.content = lorem.paragraph(sample([1, 2, 3]));
    this.date = date.recent(sample([1, 2, 3, 4, 5, 10, 15]));
    this.image = Math.random() * 10 > 3 ? null : createShareableImage();
    this.likes = random.number(1, 100);
    this.link = random.boolean() ? null : {
      url: internet.url(),
      title: lorem.words(rand(1, 5)),
      description: lorem.sentences(rand(1, 2), '. '),
    };
    this.user = user;
  }
}

class Comment {
  content: string;
  date: Date;
  id: string;
  likes: number;
  user: ?Object;
  constructor(user) {
    this.id = uuid();
    this.content = lorem.paragraph(sample([1, 2, 3]));
    this.date = date.recent(sample([1, 2, 3, 4, 5, 10, 15]));
    this.likes = random.number(1, 100);
    this.user = user;
  }
}

function generateUsers(n) {
  const users = [];
  for (let i = 0; i < n; i++) {
    users.push(new User());
  }
  return users;
}

function generateComments(n: number, users: Array<any>) {
  const comments = [];
  for (let i = 0; i < n; i++) {
    comments.push(new Comment(sample(users)));
  }
  return comments;
}

function generatePosts(n: number, users: Array<User>, comments: Array<Comment>) {
  const posts = [];
  for (let i = 0; i < n; i++) {
    const newPost = new Post(sample(users));
    newPost.comments = sampleSize(comments, random.number(7));
    posts.push(newPost);
  }
  return posts;
}

export function seed(nUsers: number = 100, nPosts: number = 500, nComments: number = 500) {
  const spinner = ora('Generating sample data...').start();
  mkdirp.sync(join(__dirname, 'seed'));
  const users = generateUsers(nUsers);
  const comments = generateComments(nComments, users);
  const posts = generatePosts(nPosts, users, comments);
  Promise.all([
    write(join(__dirname, 'seed', 'db.json'), JSON.stringify({
      users,
      posts,
      comments,
    })),
  ])
  .then(() => {
    spinner.text = '🎉 🎉 🎉 🎉  Done writing sample data 🎉 🎉 🎉 🎉';
    setTimeout(() => spinner.stop(), 2000);
  })
  .catch(err => {
    console.error(err);
    setTimeout(() => spinner.stop());
  });
}

seed();
