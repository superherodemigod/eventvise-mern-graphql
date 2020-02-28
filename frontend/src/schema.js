import gql from 'graphql-tag';

export const GET_PROJECTS = gql`
    query getProjects {
        getProjects {
            id
            title
            download
            view
            date
            json
        }
    }
`;

export const ADD_PROJECT = gql`
    mutation addProject($title: String, $user: String!, $file: Upload, $date: String) {
        addProject (title: $title, user: $user file: $file, date: $date)
    }
`;

export const DOWNLOAD_PROJECT = gql`
    mutation downloadProject($json: Upload) {
        downloadProject(json: $json)
    }
`;

export const GET_USER = gql`
    query user($nickname: String!) {
        getUser(nickname: $nickname) {
            nickname
            tags
            type
            projects {
                id
                title
                download
                view
                date
                json
            }
        }
    }
`;

export const GET_USER_LIGHT = gql`
    query user($nickname: String!) {
        getUser(nickname: $nickname) {
            nickname
            tags
            type
        }
    }
`;

export const GET_USER_MEDIUM = gql`
    query user($nickname: String!) {
        getUser(nickname: $nickname) {
            nickname
            tags
            email
            type
            projects {
                id
                title
                download
                view
                date
            }
        }
    }
`;

export const GET_USERS = gql`
    query getUsers {
        getUsers {
            nickname
            email
            tags
        }
    }
`;

export const USER_AUTH = gql`
    query userAuth($login: String!, $password: String!) {
        userAuth(login: $login, password: $password)
    }
`;

export const ADD_USER = gql`
    mutation adduser($nickname: String!, $email: String!, $type: String!, $password: String!, $tags: String) {
        addUser(nickname: $nickname, email: $email, type: $type, password: $password, tags: $tags)
    }
`;

export const REMOVE_USER = gql`
    mutation removeUser($nickname: String!) {
        removeUser(nickname: $nickname)
    }
`;

export const REMOVE_USER_ANIMATION = gql`
    mutation removeUserAnimation($nickname: String!, $animation: String!) {
        removeUserAnimation(nickname: $nickname, animation: $animation)
    }
`;

export const ADD_TAG = gql`
    mutation addTag($nickname: String!, $tag: String) {
        addTag(nickname: $nickname, tag: $tag) {
            nickname
        }
    }
`;
