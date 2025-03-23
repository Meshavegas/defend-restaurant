import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const BASE_URL = "http://192.168.1.10:8000";

interface ApiClientInterface {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;
  put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;
  delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;
  setAuthHeader(token: string): void;
  removeAuthHeader(): void;
}

class ApiClient implements ApiClientInterface {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    let networkIp = "";

    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        signature: "base64:fqH2xn2oVbjhHkW9r273Qu6P1GCktSVeCAF3JuLXQJw=",
        //  "App-Version": `${getVersion()}(${getBuildNumber()})`,
        //  "IP-Address": networkIp,
        //  "Device-Model": `${getBrand()}, ${getModel()}`,
        //  "Device-OS": `${Platform.OS}, ${getSystemVersion()}`,
      },
    });

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  private initializeRequestInterceptor() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(
          "API Request:",
          JSON.stringify(
            {
              url: config.url,
              method: config.method,
              data: config.data,
              headers: config.headers,
              baseURL: config.baseURL,
            },
            null,
            2
          )
        );
        //  const token = useAuthStore.getState().token;
        //  if (token && token !== "" && !config.headers.Authorization) {
        //    apiClient.setAuthHeader(token);
        //    config.headers["Authorization"] = `Bearer ${token}`;
        //    return {
        //      ...config,
        //      headers: {
        //        ...config.headers,
        //        Authorization: `Bearer ${token}`,
        //      },
        //    };
        //  }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
  }

  private initializeResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(
          "API Response:",
          JSON.stringify(
            {
              url: response.config.url,
              status: response.status,
              data: response.data,
            },
            null,
            2
          )
        );
        return response;
      },
      (error: AxiosError) => {
        console.log(
          "API Response:",
          JSON.stringify(
            {
              url: error.response?.config.url,
              status: error.response?.status,
              data: error.response?.data,
            },
            null,
            2
          )
        );
        return Promise.reject(error);
      }
    );
  }

  public get<T>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public post<T>(
    url: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public put<T>(
    url: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public delete<T>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  public setAuthHeader(token: string): void {
    console.log("setAuthHeader", token);

    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  public removeAuthHeader(): void {
    delete this.axiosInstance.defaults.headers.common["Authorization"];
  }
}

// Solution pour l'IP (à adapter selon vos besoins)

// Instance singleton
export const apiClient = new ApiClient();
