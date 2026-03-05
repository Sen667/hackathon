import type { ApiResponse, PaginatedResponse } from '@/types';

class ApiClient {
    private baseUrl = '/api';

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        };

        // Get CSRF token from meta tag
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');
        if (csrfToken) {
            headers['X-CSRF-TOKEN'] = csrfToken;
        }

        // Merge with any additional headers
        if (options.headers) {
            Object.assign(headers, options.headers);
        }

        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'same-origin', // Important pour Sanctum
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: 'Une erreur est survenue',
            }));
            throw new Error(error.message || 'Une erreur est survenue');
        }

        return response.json();
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiClient();

// Helper pour extraire les données d'une réponse API
export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
    if (!response.success) {
        throw new Error(response.message || 'Une erreur est survenue');
    }
    return response.data as T;
}

// Helper pour les réponses paginées
export function unwrapPaginatedResponse<T>(
    response: ApiResponse<PaginatedResponse<T>>,
): PaginatedResponse<T> {
    if (!response.success) {
        throw new Error(response.message || 'Une erreur est survenue');
    }
    return response.data as PaginatedResponse<T>;
}
