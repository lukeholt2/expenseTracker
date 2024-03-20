# Plutus

`Plutus` is the updated UI intended for interacting with the [`ExpenseAPI`](https://gitlab.internal.oasis.com/gitlab-instance-8c9d9f19/expenseapp), allowing for custom expense tracking and budgeting. 

The core of the project is written using Angular, but is enhanced by the [`iconic framework`](https://ionicframework.com/) to improve the accessiblility from mobile devices (where most usage occurs).


## Development

As mentioned above, the project is written in Angular and thus can simple be installed using `npm`:

```script
npm i
```

Then to run the development server simply run:

```script
ionic serve
```


### Running on Mobile

To run on mobile first ensure the app is in synce with the latest changes:

```script
ionic cap copy
ionic cap sync
```

Then run the mobile version(s) using


```script
ionic cap open <android | ios>
```