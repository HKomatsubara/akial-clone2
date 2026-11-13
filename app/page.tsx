"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, Calendar, CheckCircle2, AlertCircle, XCircle, Building2, Phone, Mail } from "lucide-react";

// --- 型定義 ---
type VacancyStatus = "VACANT" | "FEW" | "FULL";

interface Facility {
  id: string;
  name: string;
  prefecture: string;
  city: string;
  address: string;
  vacancyStatus: VacancyStatus;
  availableBeds: number;
  monthlyFeeMin: number;
  monthlyFeeMax: number;
  targetDisabilities: string[];
  medicalSupport: boolean;
  nightStaff: boolean;
  imageUrl: string;
}

// --- 初期ダミーデータ ---
const INITIAL_FACILITIES: Facility[] = [
  {
   id: "fac-1",
   name: "グループホーム aさくらガーデン新宿",
   prefecture: "東京都",
   city: "新宿区",
   address: "東京都新宿区西新宿 1-1-1",
   vacancyStatus: "VACANT",
   availableBeds: 2,
   monthlyFeeMin: 65000,
   monthlyFeeMax: 85000,
   targetDisabilities: ["知的", "精神"],
   medicalSupport: true,
   nightStaff: true,
   imageUrl:
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
 },
 {
   id: "fac-2",
   name: "ひまわりハイツ11 渋谷",
   prefecture: "東京都",
   city: "渋谷区",
   address: "東京都渋谷区神南 1-2-3",
   vacancyStatus: "FEW",
   availableBeds: 1,
   monthlyFeeMin: 78000,
   monthlyFeeMax: 95000,
   targetDisabilities: ["身体", "知的"],
   medicalSupport: false,
   nightStaff: true,
   imageUrl:
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
 },
 {
   id: "fac-3",
   name: "メープルハウス 横浜中央",
   prefecture: "神奈川県",
   city: "横浜市",
   address: "神奈川県横浜市中区本町 2-4",
   vacancyStatus: "FULL",
   availableBeds: 0,
   monthlyFeeMin: 60000,
   monthlyFeeMax: 75000,
   targetDisabilities: ["精神"],
   medicalSupport: true,
   nightStaff: false,
    imageUrl:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
  },
];

export default function AkialPlatformApp() {
 // --- 状態管理 ---
 const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
 const [selectedPrefecture, setSelectedPrefecture] = useState<string>("ALL");
 const [onlyVacant, setOnlyVacant] = useState<boolean>(false);
 const [selectedDisability, setSelectedDisability] = useState<string>("ALL");

 // モーダル用
 const [bookingFacility, setBookingFacility] = useState<Facility | null>(null);
 const [bookingDate, setBookingDate] = useState<string>("");
 const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);

 // フィルタリングロジック
 const filteredFacilities = useMemo(() => {
   return facilities.filter((item) => {
     if (selectedPrefecture !== "ALL" && item.prefecture !== selectedPrefecture) return false;
     if (onlyVacant && item.vacancyStatus === "FULL") return false;
     if (selectedDisability !== "ALL" && !item.targetDisabilities.includes(selectedDisability)) return false;
     return true;
   });
 }, [facilities, selectedPrefecture, onlyVacant, selectedDisability]);

 // 空室ステータス変更ハンドラー（管理者操作のシミュレーション）
 const toggleVacancy = (id: string) => {
   setFacilities((prev) =>
     prev.map((f) => {
       if (f.id === id) {
         const nextStatus: VacancyStatus =
           f.vacancyStatus === "VACANT" ? "FEW" : f.vacancyStatus === "FEW" ? "FULL" : "VACANT";
         return {
           ...f,
           vacancyStatus: nextStatus,
           availableBeds: nextStatus === "FULL" ? 0 : nextStatus === "FEW" ? 1 : 2,
         };
       }
       return f;
     })
   );
 };
 // 見学予約送信
 const handleBookingSubmit = (e: React.FormEvent) => {
   e.preventDefault();
   if (!bookingDate || !bookingFacility) return;
   setBookingSuccessMessage(`${bookingFacility.name}の ${bookingDate} 見学予約を受付しました。`);
   setTimeout(() => {
     setBookingFacility(null);
     setBookingDate("");
     setBookingSuccessMessage(null);
   }, 3000);
 };

 return (
  <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
    {/* ヘッダー */}
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
       <div className="flex items-center space-x-2">
        <Building2 className="w-8 h-8 text-emerald-600" aria-hidden="true" />
        <h1 className="text-xl font-bold tracking-tight">障がい者ホーム検索「アキアルナビ」</h1>
       </div>
       <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
        デプロイ検証用プロトタイプ
       </span>
      </div>
    </header>

  <main className="max-w-7xl mx-auto px-4 py-8">
   {/* 検索・フィルターエリア */}
   <section
     aria-label="検索フィルター"
     className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8"
   >
     <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Search className="w-5 h-5 text-emerald-600" aria-hidden="true" /> 条件を指定して検索
     </h2>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 都道府県選択 */}
      <div>
        <label htmlFor="pref-select" className="block text-sm font-medium mb-1">
         エリア（都道府県）
        </label>
        <select
          id="pref-select"
          value={selectedPrefecture}
          onChange={(e) => setSelectedPrefecture(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
         >
          <option value="ALL">全国すべてのエリア</option>
          <option value="東京都">東京都</option>
          <option value="神奈川県">神奈川県</option>
         </select>
        </div>

        {/* 障害種別選択 */}
        <div>
          <label htmlFor="disability-select" className="block text-sm font-medium mb-1">
           障がい種別
          </label>
          <select
           id="disability-select"
           value={selectedDisability}
           onChange={(e) => setSelectedDisability(e.target.value)}
           className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
           <option value="ALL">すべての障がい種別</option>
           <option value="知的">知的障害</option>
           <option value="精神">精神障害</option>
           <option value="身体">身体障害</option>
          </select>
        </div>

        {/* 空室フラグ */}
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
           <input
             type="checkbox"
             checked={onlyVacant}
             onChange={(e) => setOnlyVacant(e.target.checked)}
             className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
           />
           <span className="text-sm font-medium">空室あり（◯・△）のみ表示</span>
          </label>
        </div>
      </div>
     </section>

    {/* 施設一覧表示 */}
    <section aria-label="施設検索結果">
     <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">
       検索結果 <span className="text-emerald-600">{filteredFacilities.length}</span>件
       </h2>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <article
            key={facility.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-slate-200">
               <img
                 src={facility.imageUrl}
                 alt={`${facility.name}の外観画像`}
                 className="w-full h-full object-cover"
               />
               {/* 空室バッジ */}
               <div className="absolute top-3 right-3">
                 {facility.vacancyStatus === "VACANT" && (
                   <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                    <CheckCircle2 className="w-4 h-4" /> ◯ 空室あり ({facility.availableBeds}床)
                   </span>
                 )}
                 {facility.vacancyStatus === "FEW" && (
                   <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                    <AlertCircle className="w-4 h-4" /> △ 残りわずか ({facility.availableBeds}床)
                   </span>
                 )}
                 {facility.vacancyStatus === "FULL" && (
                   <span className="bg-slate-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                    <XCircle className="w-4 h-4" /> × 満室
                   </span>
                 )}
               </div>
              </div>

           <div className="p-5">
            <h3 className="text-lg font-bold mb-2 text-slate-800">{facility.name}</h3>
            <p className="text-sm text-slate-600 flex items-center gap-1 mb-3">
             <MapPin className="w-4 h-4 text-slate-400" /> {facility.address}
            </p>

              <div className="space-y-2 mb-4">
                <div className="text-sm">
                 <span className="text-slate-500">概算月額: </span>
                 <span className="font-bold text-slate-800">
                   {facility.monthlyFeeMin.toLocaleString()}円 〜 {facility.monthlyFeeMax.toLocaleString()}円
                 </span>
                </div>
                <div className="flex flex-wrap gap-1">
                 {facility.targetDisabilities.map((d) => (
                   <span key={d} className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">
                     {d}
                   </span>
                 ))}
                 {facility.nightStaff && (
                   <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded border border-blue-200">
                     夜間配置あり
                   </span>
                 )}
                </div>
              </div>
             </div>
            </div>

         <div className="p-5 pt-0 space-y-2">
           <button
            onClick={() => setBookingFacility(facility)}
            disabled={facility.vacancyStatus === "FULL"}
            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
              facility.vacancyStatus === "FULL"
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            }`}
           >
            <Calendar className="w-4 h-4" /> 見学を予約する
           </button>

           {/* 管理者用：空室ステータス切り替えシミュレーション */}
           <button
             onClick={() => toggleVacancy(facility.id)}
              className="w-full py-1 text-xs text-slate-500 hover:text-slate-800 underline text-center block"
             >
              [管理者操作] ステータス切り替えテスト
             </button>
            </div>
          </article>
        ))}
       </div>
      </section>
    </main>

   {/* 見学予約モーダル */}
   {bookingFacility && (
     <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
       <h3 className="text-lg font-bold mb-2">見学申し込み</h3>
       <p className="text-sm text-slate-600 mb-4">{bookingFacility.name}</p>

        {bookingSuccessMessage ? (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-sm font-medium">
           {bookingSuccessMessage}
          </div>
        ):(
          <form onSubmit={handleBookingSubmit} className="space-y-4">
           <div>
            <label htmlFor="booking-date" className="block text-sm font-medium mb-1">
              見学希望日
            </label>
            <input
              id="booking-date"
              type="date"
              required
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
           </div>
           <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setBookingFacility(null)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
               キャンセル
              </button>
              <button
               type="submit"
               className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold"
              >
               送信する
              </button>
            </div>
           </form>
         )}
        </div>
       </div>
     )}
    </div>
  );
}
