"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

function SettingsContent() {
  const { user, profile, isPro, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralStats, setReferralStats] = useState<{ count: number; monthsEarned: number } | null>(null);
  const [referralCopied, setReferralCopied] = useState(false);

  // Track whether we came from a successful checkout
  const [pendingProPoll, setPendingProPoll] = useState(false);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      setCheckoutMessage("Subscrição ativada com sucesso! Bem-vindo ao Pro.");
      setPendingProPoll(true);
      window.history.replaceState({}, "", "/dashboard/settings");
    } else if (checkout === "cancelled") {
      window.history.replaceState({}, "", "/dashboard/settings");
    }
  }, [searchParams]);

  // Poll for pro status once user is available
  useEffect(() => {
    if (!pendingProPoll || !user) return;
    if (isPro()) {
      setPendingProPoll(false);
      return;
    }

    let cancelled = false;
    const poll = async (attempt: number) => {
      if (cancelled || attempt >= 15) {
        setPendingProPoll(false);
        return;
      }
      const updated = await refreshProfile();
      if (updated?.subscription_tier === "pro") {
        setPendingProPoll(false);
        return;
      }
      setTimeout(() => poll(attempt + 1), 2000);
    };
    poll(0);
    return () => { cancelled = true; };
  }, [pendingProPoll, user, isPro, refreshProfile]);

  // Fetch referral code and stats once the user is available
  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/referral/generate").then((r) => r.json()),
      fetch("/api/referral/stats").then((r) => r.json()),
    ])
      .then(([codeData, statsData]) => {
        if (codeData.code) setReferralCode(codeData.code);
        if (typeof statsData.count === "number") setReferralStats(statsData);
      })
      .catch(() => {
        // Non-critical: silently ignore referral fetch failures
      });
  }, [user]);

  const handleCopyReferral = async () => {
    if (!referralCode) return;
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setReferralCopied(true);
      setTimeout(() => setReferralCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore
    }
  };

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

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    setDeleteAccountError(null);

    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao eliminar conta");
      }

      // Sign out and redirect to home after successful deletion
      await signOut();
      router.push("/");
    } catch (err) {
      setDeleteAccountError(
        err instanceof Error ? err.message : "Erro ao eliminar conta"
      );
      setIsDeletingAccount(false);
    }
  };

  const handleUpgrade = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval: billingInterval }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erro ao processar pagamento"
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsOpeningPortal(true);
    try {
      const response = await fetch("/api/billing-portal", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao abrir portal");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao abrir portal");
    } finally {
      setIsOpeningPortal(false);
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

  const checkIconSmall = (
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
  );

  return (
    <div className="max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Definições</h1>
        <p className="text-gray-500 mt-1">Gerir a sua conta e subscrição</p>
      </div>

      {/* Checkout success banner */}
      {checkoutMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{checkoutMessage}</p>
        </div>
      )}

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
            <h2 className="text-lg font-semibold text-gray-900">Subscrição</h2>
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
                      Fundador
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

                {/* Free tier features + upgrade CTA */}
                {!isPro() && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      O seu plano inclui:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        {checkIconSmall}
                        1 ano de dados
                      </li>
                      <li className="flex items-center gap-2">
                        {checkIconSmall}
                        Gráficos básicos
                      </li>
                      <li className="flex items-center gap-2">
                        {checkIconSmall}
                        Visualização de recibos
                      </li>
                    </ul>

                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-900 mb-2">
                        Faça upgrade para Pro
                      </p>
                      <ul className="text-sm text-green-800 space-y-1 mb-4">
                        <li>{"✓"} Anos ilimitados de dados</li>
                        <li>{"✓"} Comparações multi-ano</li>
                        <li>{"✓"} Análise detalhada por cliente</li>
                        <li>{"✓"} Exportar para PDF/Excel</li>
                      </ul>

                      {/* Billing interval toggle */}
                      <div className="mb-4 inline-flex items-center rounded-full bg-green-100 p-1">
                        <button
                          onClick={() => setBillingInterval("monthly")}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                            billingInterval === "monthly"
                              ? "bg-white text-green-900 shadow-sm"
                              : "text-green-700 hover:text-green-900"
                          }`}
                        >
                          Mensal — 2,99€/mês
                        </button>
                        <button
                          onClick={() => setBillingInterval("annual")}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                            billingInterval === "annual"
                              ? "bg-white text-green-900 shadow-sm"
                              : "text-green-700 hover:text-green-900"
                          }`}
                        >
                          Anual — 29,90€/ano
                          <span className="ml-1 text-xs text-green-600">
                            (Poupa 2 meses)
                          </span>
                        </button>
                      </div>

                      <div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleUpgrade}
                          loading={isCheckingOut}
                        >
                          {billingInterval === "monthly"
                            ? "Fazer upgrade por 2,99€/mês"
                            : "Fazer upgrade por 29,90€/ano"}
                        </Button>
                      </div>
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
                        {checkIconSmall}
                        Anos ilimitados de dados
                      </li>
                      <li className="flex items-center gap-2">
                        {checkIconSmall}
                        Comparações multi-ano
                      </li>
                      <li className="flex items-center gap-2">
                        {checkIconSmall}
                        Análise detalhada por cliente
                      </li>
                      <li className="flex items-center gap-2">
                        {checkIconSmall}
                        Exportar para PDF/Excel
                      </li>
                    </ul>

                    {profile?.subscription_tier === "pro" &&
                      profile.stripe_customer_id && (
                        <div className="mt-4 space-y-2">
                          {profile.subscription_interval && (
                            <p className="text-xs text-gray-500">
                              Plano:{" "}
                              {profile.subscription_interval === "annual"
                                ? "Anual"
                                : "Mensal"}
                            </p>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleManageSubscription}
                            loading={isOpeningPortal}
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
                      Obrigado por ser um membro fundador!
                    </p>
                    <p className="text-sm text-purple-800">
                      Tem acesso Pro vitalício como agradecimento pelo seu apoio
                      inicial.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Referral Program — hidden until feature is ready */}
        {false && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Programa de Referência
            </h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <p className="text-sm text-gray-600">
              Convide amigos e ganhe 1 mês de Pro por cada conta criada com o
              seu link.
            </p>

            {referralCode ? (
              <>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${referralCode}`}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700 truncate"
                  />
                  <Button variant="outline" size="sm" onClick={handleCopyReferral}>
                    {referralCopied ? "Copiado!" : "Copiar"}
                  </Button>
                </div>

                {referralStats && (
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {referralStats!.count}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {referralStats!.count === 1
                          ? "amigo convidado"
                          : "amigos convidados"}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-700">
                        {referralStats!.monthsEarned}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {referralStats!.monthsEarned === 1
                          ? "mês ganho"
                          : "meses ganhos"}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            )}
          </div>
        </div>
        )}

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
                  Remove permanentemente todos os recibos importados da sua
                  conta. Esta ação não pode ser revertida.
                </p>

                {deleteSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      Todos os recibos foram eliminados com sucesso. A
                      redirecionar...
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
          <div className="px-6 py-4 space-y-6">
            <Button
              variant="outline"
              onClick={signOut}
              className="text-gray-700"
            >
              Terminar sessão
            </Button>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Eliminar conta
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Elimina permanentemente a sua conta e todos os dados associados,
                incluindo recibos e subscrição. Esta ação não pode ser revertida.
              </p>

              {deleteAccountError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{deleteAccountError}</p>
                </div>
              )}

              {!showDeleteAccountConfirm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteAccountConfirm(true)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Eliminar conta
                </Button>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-1">
                    Tem a certeza? Esta ação é irreversível.
                  </p>
                  <p className="text-sm text-red-700 mb-3">
                    Todos os seus recibos e dados serão eliminados e a sua
                    subscrição será cancelada imediatamente.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleDeleteAccount}
                      loading={isDeletingAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Sim, eliminar conta
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteAccountConfirm(false)}
                      disabled={isDeletingAccount}
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
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Definições</h1>
            <p className="text-gray-500 mt-1">A carregar...</p>
          </div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
