import Cookie from "js-cookie";

export type RequestMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
export type FetchFunction = (input: RequestInfo | URL, init?: RequestInit | undefined) => {}

export interface Request<T = any> {
    url: string;
    method: RequestMethods;
    body: T | null,
    headers: object
}

export interface Response<Data = any> {
    error: HttpException | null;
    data: Data;
    abort: AbortController
}

export class HttpException implements Error {
    name: string;
    message: string;
    stack?: string | undefined;
    cause?: Error | undefined;
    response: globalThis.Response

    constructor(response: globalThis.Response) {
        this.name = "HttpException"
        this.message = `Http request returned ${response.statusText}`
        this.response = response;
    }
}

export class RequestBuilder<BodyInterface = any> {

    _token    : string | null = Cookie.get("XSRF-TOKEN") ?? null;
    _request  : Request<BodyInterface> | null = null
    _response : Response | null = null


    _getBaseHeaders(): object {
        const baseHeaders = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        return baseHeaders;
    }

    get(url: string, headers: object = {}): Promise<Response> {

        this._request = {
            url: url,
            body: null,
            method: "GET",
            headers: { ...this._getBaseHeaders(), ...headers },
        }

        return this.send();
    }

    post(url: string, body: BodyInterface | null = null, headers: object = {}): Promise<Response> {

        this._request = {
            url: url,
            body: body,
            method: "POST",
            headers: { ...this._getBaseHeaders(), ...headers },
        }
        return this.send();
    }

    patch(url: string, body: BodyInterface | null = null, headers: object = {}): Promise<Response> {
        this._request = {
            url: url,
            body: body,
            method: "PATCH",
            headers: { ...this._getBaseHeaders(), ...headers },
        }
        return this.send();
    }

    put(url: string, body: BodyInterface | null = null, headers: object = {}): Promise<Response> {
        this._request = {
            url: url,
            body: body,
            method: "PUT",
            headers: { ...this._getBaseHeaders(), ...headers },
        }
        return this.send();
    }

    delete(url: string, body: BodyInterface | null = null, headers: object = {}): Promise<Response> {
        this._request = {
            url: url,
            body: body,
            method: "DELETE",
            headers: { ...this._getBaseHeaders(), ...headers },
        }

        return this.send();
    }

    addHeader(header: object): void {
        this._request!.headers = { ...this._request!.headers, ...header }
    }

    initializeResponse() {
        this._response = {
            data: null,
            error: null,
            abort: new AbortController()
        }
    }

    async send(): Promise<Response> {

        this.initializeResponse();

        if (this._token !== null) {

            this.addHeader({ "X-XSRF-TOKEN": this._token });
        }

        try {
            const response = await fetch(
                new URL(this._request!.url),
                {
                    method: this._request!.method,
                    body: this._request!.body === null ? null : JSON.stringify(this._request!.body),
                    headers: new Headers({ ...this._request!.headers }),
                    credentials: "include",
                    signal: this._response!.abort.signal,
                }
            )

            if (!response.ok) {

                if (response.status === 401 || response.status === 419) {

                    // window.location.replace(import.meta.env.VITE_LOGIN_REDIRECT_URL ?? "https://lucys.app/login");
                }

                throw new HttpException(response)
            }

            if (response.status !== 204) {

                this._response!.data = await response.json()
            }

        } catch (e) {

            this._response!.error = e as HttpException;
        }

        return this._response!
    }

}