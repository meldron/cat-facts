import { Show } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { FormError } from "solid-start/data";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { db } from "~/db";
import { createUserSession, getUser, login, register } from "~/db/session";

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

export function routeData() {
  return createServerData$(async (_, { request }) => {
    if (await getUser(db, request)) {
      throw redirect("/");
    }
    return {};
  });
}

export default function Login() {
  const data = useRouteData<typeof routeData>();
  const params = useParams();

  const [loggingIn, { Form }] = createServerAction$(async (form: FormData) => {
    const loginType = form.get("loginType");
    const username = form.get("username");
    const password = form.get("password");
    const redirectTo = form.get("redirectTo") || "/";
    if (
      typeof loginType !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof redirectTo !== "string"
    ) {
      throw new FormError(`Form not submitted correctly.`);
    }

    const fields = { loginType, username, password };
    const fieldErrors = {
      username: validateUsername(username),
      password: validatePassword(password),
    };
    if (Object.values(fieldErrors).some(Boolean)) {
      throw new FormError("Fields invalid", { fieldErrors, fields });
    }

    switch (loginType) {
      case "login": {
        const user = await login({ username, password });
        if (!user) {
          throw new FormError(`Username/Password combination is incorrect`, {
            fields,
          });
        }
        return createUserSession(`${user.id}`, redirectTo);
      }
      case "register": {
        const userExists = await db.user.findUnique({ where: { username } });
        if (userExists) {
          throw new FormError(`User with username ${username} already exists`, {
            fields,
          });
        }

        const user = await register({ username, password });
        if (!user) {
          throw new FormError(
            `Something went wrong trying to create a new user.`,
            {
              fields,
            }
          );
        }
        return createUserSession(`${user.id}`, redirectTo);
      }
      default: {
        throw new FormError(`Login type invalid`, { fields });
      }
    }
  });

  return (
    <main>
      <div class="card min-w-min m-auto w-1/3 bg-base-100 shadow-xl p-10">
        <h2 class="card-title">Login</h2>
        <Form>
          <input
            type="hidden"
            name="redirectTo"
            value={params.redirectTo ?? "/"}
          />
          <div class="form-control">
            <label class="label">
              <span class="label-text">Your unique Username</span>
            </label>
            <label class="input-group">
              <span>Username</span>
              <input
                type="text"
                name="username"
                placeholder="Username"
                class="input input-bordered"
              />
            </label>
            <Show when={loggingIn.error?.fieldErrors?.username}>
              <label class="label">
                <span class="label-text-alt text-red-600">
                  {loggingIn.error?.fieldErrors.username}
                </span>
              </label>
            </Show>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Your secure Password</span>
            </label>
            <label class="input-group">
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                class="input input-bordered"
              />
            </label>
            <Show when={loggingIn.error?.fieldErrors?.password}>
              <label class="label">
                <span class="label-text-alt text-red-600">
                  {loggingIn.error?.fieldErrors.password}
                </span>
              </label>
            </Show>
          </div>
          <fieldset class="my-5">
            <span class="mr-2">
              <input
                type="radio"
                name="loginType"
                value="login"
                class="radio"
                checked
              />{" "}
              Login
            </span>
            <span>
              <input
                type="radio"
                name="loginType"
                value="register"
                class="radio"
              />{" "}
              Register
            </span>
          </fieldset>
          <Show when={loggingIn.error}>
            <div class="alert alert-error shadow-lg">
              <div>
                <span>{loggingIn.error.message}</span>
              </div>
            </div>
          </Show>
          <div class="mt-2 card-actions justify-end">
            <button class="btn btn-primary" type="submit">
              {data() ? "Login" : ""}
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
