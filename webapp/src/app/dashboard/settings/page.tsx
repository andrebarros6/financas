"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { user, profile, isPro, signOut } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleDeleteAllData = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch("/api/receipts", {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao eliminar dados");
      }

      setDeleteSuccess(true);
      setShowDeleteConfirm(false);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Erro ao eliminar dados"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-PT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const getSubscriptionStatus = () => {
    if (!profile) return null;

    if (profile.is_founding_member) {
      return {
        status: "Membro Fundador",
        description: "Acesso Pro vitalício",
        badge: "founding",
      };
    }

    if (profile.subscription_tier === "pro") {
      if (profile.subscription_expires_at) {
        const expiresAt = new Date(profile.subscription_expires_at);
        const isExpired = expiresAt < new Date();

        if (isExpired) {
          return {
            status: "Expirado",
            description: `Expirou a ${formatDate(profile.subscription_expires_at)}`,
            badge: "expired",
          };
        }

        return {
          status: "Pro",
          description: `Válido até ${formatDate(profile.subscription_expires_at)}`,
          badge: "pro",
        };
      }

      return {
        status: "Pro",
        description: "Subscrição ativa",
        badge: "pro",
      };
    }

    if (profile.trial_started_at) {
      const trialStart = new Date(profile.trial_started_at);
      const trialEnd = new Date(trialStart);
      trialEnd.setDate(trialEnd.getDate() + 7);

      if (trialEnd > new Date()) {
        return {
          status: "Trial Pro",
          description: `Trial válido até ${formatDate(trialEnd.toISOString())}`,
          badge: "trial",
        };
      }

      return {
        status: "Gratuito",
        description: "Trial expirado",
        badge: "free",
      };
    }

    return {
      status: "Gratuito",
      description: "Limitado a 1 ano de dados",
      badge: "free",
    };
  };

  const subscriptionInfo = getSubscriptionStatus();

  return (
    <div className="max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Definições</h1>
        <p className="text-gray-500 mt-1">
          Gerir a sua conta e subscrição
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Informação da Conta
            </h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Membro desde
              </label>
              <p className="mt-1 text-gray-900">
                {profile?.created_at && formatDate(profile.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Information */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Subscrição
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {subscriptionInfo?.status}
                  </h3>
                  {subscriptionInfo?.badge === "founding" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      ⭐ Fundador
                    </span>
                  )}
                  {subscriptionInfo?.badge === "pro" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Pro
                    </span>
                  )}
                  {subscriptionInfo?.badge === "trial" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Trial
                    </span>
                  )}
                  {subscriptionInfo?.badge === "free" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Gratuito
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {subscriptionInfo?.description}
                </p>

                {/* Free tier features */}
                {!isPro() && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      O seu plano inclui:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        1 ano de dados
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Gráficos básicos
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Visualização de recibos
                      </li>
                    </ul>

                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-900 mb-2">
                        Faça upgrade para Pro
                      </p>
                      <ul className="text-sm text-green-800 space-y-1 mb-4">
                        <li>✓ Anos ilimitados de dados</li>
                        <li>✓ Comparações multi-ano</li>
                        <li>✓ Análise detalhada por cliente</li>
                        <li>✓ Exportar para PDF/Excel</li>
                      </ul>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => alert("Stripe integration coming soon!")}
                      >
                        Fazer upgrade por €2.99/mês
                      </Button>
                    </div>
                  </div>
                )}

                {/* Pro tier features */}
                {isPro() && !profile?.is_founding_member && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      O seu plano Pro inclui:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Anos ilimitados de dados
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Comparações multi-ano
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Análise detalhada por cliente
                      </li>
                      <li className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Exportar para PDF/Excel
                      </li>
                    </ul>

                    {profile?.subscription_tier === "pro" &&
                      profile.stripe_customer_id && (
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              alert("Stripe customer portal coming soon!")
                            }
                          >
                            Gerir subscrição
                          </Button>
                        </div>
                      )}
                  </div>
                )}

                {/* Founding member */}
                {profile?.is_founding_member && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-purple-900 mb-1">
                      🎉 Obrigado por ser um membro fundador!
                    </p>
                    <p className="text-sm text-purple-800">
                      Tem acesso Pro vitalício como agradecimento pelo seu apoio inicial.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Gestão de Dados
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Eliminar todos os recibos
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Remove permanentemente todos os recibos importados da sua conta.
                  Esta ação não pode ser revertida.
                </p>

                {deleteSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Todos os recibos foram eliminados com sucesso.
                      A redirecionar...
                    </p>
                  </div>
                )}

                {deleteError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{deleteError}</p>
                  </div>
                )}

                {!showDeleteConfirm ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Eliminar todos os recibos
                  </Button>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-900 mb-3">
                      Tem a certeza? Esta ação é irreversível.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleDeleteAllData}
                        loading={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Sim, eliminar tudo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeleting}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Ações da Conta
            </h2>
          </div>
          <div className="px-6 py-4">
            <Button
              variant="outline"
              onClick={signOut}
              className="text-gray-700"
            >
              Terminar sessão
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
