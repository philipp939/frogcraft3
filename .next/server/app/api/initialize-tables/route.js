/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/initialize-tables/route";
exports.ids = ["app/api/initialize-tables/route"];
exports.modules = {

/***/ "(rsc)/./app/api/initialize-tables/route.ts":
/*!********************************************!*\
  !*** ./app/api/initialize-tables/route.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase */ \"(rsc)/./lib/supabase.ts\");\n\n\nasync function GET() {\n    try {\n        const supabase = (0,_lib_supabase__WEBPACK_IMPORTED_MODULE_1__.createServerSupabaseClient)();\n        // Create player_settings table\n        const createPlayerSettingsTable = `\n      CREATE TABLE IF NOT EXISTS public.player_settings (\n        id SERIAL PRIMARY KEY,\n        username TEXT NOT NULL UNIQUE,\n        pvp_enabled BOOLEAN DEFAULT false,\n        verified BOOLEAN DEFAULT false,\n        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n      );\n      \n      CREATE INDEX IF NOT EXISTS idx_player_settings_username ON public.player_settings(username);\n    `;\n        const { error: settingsError } = await supabase.from('_supabase_schema').select('*').then(async ()=>{\n            return await supabase.rpc('exec_sql', {\n                query: createPlayerSettingsTable\n            });\n        });\n        if (settingsError) {\n            console.error(\"Error creating player_settings table:\", settingsError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Error creating player_settings table\"\n            }, {\n                status: 500\n            });\n        }\n        // Create bans table\n        const createBansTable = `\n      CREATE TABLE IF NOT EXISTS public.bans (\n        id SERIAL PRIMARY KEY,\n        uuid TEXT,\n        username TEXT NOT NULL,\n        reason TEXT NOT NULL,\n        banned_by TEXT NOT NULL,\n        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n        duration_minutes INTEGER DEFAULT 0,\n        source TEXT DEFAULT 'web',\n        active BOOLEAN DEFAULT true\n      );\n      \n      CREATE INDEX IF NOT EXISTS idx_bans_username ON public.bans(username);\n      CREATE INDEX IF NOT EXISTS idx_bans_uuid ON public.bans(uuid);\n      CREATE INDEX IF NOT EXISTS idx_bans_active ON public.bans(active);\n    `;\n        const { error: bansError } = await supabase.from('_supabase_schema').select('*').then(async ()=>{\n            return await supabase.rpc('exec_sql', {\n                query: createBansTable\n            });\n        });\n        if (bansError) {\n            console.error(\"Error creating bans table:\", bansError);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Error creating bans table\"\n            }, {\n                status: 500\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Tables successfully initialized\"\n        });\n    } catch (error) {\n        console.error(\"Error during table initialization:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"An error occurred: \" + (error instanceof Error ? error.message : String(error))\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2luaXRpYWxpemUtdGFibGVzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEwQztBQUNpQjtBQUdwRCxlQUFlRTtJQUNwQixJQUFJO1FBQ0YsTUFBTUMsV0FBV0YseUVBQTBCQTtRQUUzQywrQkFBK0I7UUFDL0IsTUFBTUcsNEJBQTRCLENBQUM7Ozs7Ozs7Ozs7O0lBV25DLENBQUM7UUFFRCxNQUFNLEVBQUVDLE9BQU9DLGFBQWEsRUFBRSxHQUFHLE1BQU1ILFNBQ3BDSSxJQUFJLENBQUMsb0JBQ0xDLE1BQU0sQ0FBQyxLQUNQQyxJQUFJLENBQUM7WUFDSixPQUFPLE1BQU1OLFNBQVNPLEdBQUcsQ0FBQyxZQUFZO2dCQUFFQyxPQUFPUDtZQUEwQjtRQUMzRTtRQUVGLElBQUlFLGVBQWU7WUFDakJNLFFBQVFQLEtBQUssQ0FBQyx5Q0FBeUNDO1lBQ3ZELE9BQU9OLHFEQUFZQSxDQUFDYSxJQUFJLENBQUM7Z0JBQUVSLE9BQU87WUFBdUMsR0FBRztnQkFBRVMsUUFBUTtZQUFJO1FBQzVGO1FBRUEsb0JBQW9CO1FBQ3BCLE1BQU1DLGtCQUFrQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0lBZ0J6QixDQUFDO1FBRUQsTUFBTSxFQUFFVixPQUFPVyxTQUFTLEVBQUUsR0FBRyxNQUFNYixTQUNoQ0ksSUFBSSxDQUFDLG9CQUNMQyxNQUFNLENBQUMsS0FDUEMsSUFBSSxDQUFDO1lBQ0osT0FBTyxNQUFNTixTQUFTTyxHQUFHLENBQUMsWUFBWTtnQkFBRUMsT0FBT0k7WUFBZ0I7UUFDakU7UUFFRixJQUFJQyxXQUFXO1lBQ2JKLFFBQVFQLEtBQUssQ0FBQyw4QkFBOEJXO1lBQzVDLE9BQU9oQixxREFBWUEsQ0FBQ2EsSUFBSSxDQUFDO2dCQUFFUixPQUFPO1lBQTRCLEdBQUc7Z0JBQUVTLFFBQVE7WUFBSTtRQUNqRjtRQUVBLE9BQU9kLHFEQUFZQSxDQUFDYSxJQUFJLENBQUM7WUFDdkJJLFNBQVM7UUFDWDtJQUNGLEVBQUUsT0FBT1osT0FBTztRQUNkTyxRQUFRUCxLQUFLLENBQUMsc0NBQXNDQTtRQUNwRCxPQUFPTCxxREFBWUEsQ0FBQ2EsSUFBSSxDQUN0QjtZQUFFUixPQUFPLHdCQUF5QkEsQ0FBQUEsaUJBQWlCYSxRQUFRYixNQUFNWSxPQUFPLEdBQUdFLE9BQU9kLE1BQUs7UUFBRyxHQUMxRjtZQUFFUyxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsiL2hvbWUvcHJvamVjdC9hcHAvYXBpL2luaXRpYWxpemUtdGFibGVzL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiXG5pbXBvcnQgeyBjcmVhdGVTZXJ2ZXJTdXBhYmFzZUNsaWVudCB9IGZyb20gXCJAL2xpYi9zdXBhYmFzZVwiXG5pbXBvcnQgeyBzcWwgfSBmcm9tIFwiQHZlcmNlbC9wb3N0Z3Jlc1wiXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVTZXJ2ZXJTdXBhYmFzZUNsaWVudCgpXG5cbiAgICAvLyBDcmVhdGUgcGxheWVyX3NldHRpbmdzIHRhYmxlXG4gICAgY29uc3QgY3JlYXRlUGxheWVyU2V0dGluZ3NUYWJsZSA9IGBcbiAgICAgIENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIHB1YmxpYy5wbGF5ZXJfc2V0dGluZ3MgKFxuICAgICAgICBpZCBTRVJJQUwgUFJJTUFSWSBLRVksXG4gICAgICAgIHVzZXJuYW1lIFRFWFQgTk9UIE5VTEwgVU5JUVVFLFxuICAgICAgICBwdnBfZW5hYmxlZCBCT09MRUFOIERFRkFVTFQgZmFsc2UsXG4gICAgICAgIHZlcmlmaWVkIEJPT0xFQU4gREVGQVVMVCBmYWxzZSxcbiAgICAgICAgY3JlYXRlZF9hdCBUSU1FU1RBTVAgV0lUSCBUSU1FIFpPTkUgREVGQVVMVCBOT1coKSxcbiAgICAgICAgdXBkYXRlZF9hdCBUSU1FU1RBTVAgV0lUSCBUSU1FIFpPTkUgREVGQVVMVCBOT1coKVxuICAgICAgKTtcbiAgICAgIFxuICAgICAgQ1JFQVRFIElOREVYIElGIE5PVCBFWElTVFMgaWR4X3BsYXllcl9zZXR0aW5nc191c2VybmFtZSBPTiBwdWJsaWMucGxheWVyX3NldHRpbmdzKHVzZXJuYW1lKTtcbiAgICBgXG5cbiAgICBjb25zdCB7IGVycm9yOiBzZXR0aW5nc0Vycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgICAgLmZyb20oJ19zdXBhYmFzZV9zY2hlbWEnKVxuICAgICAgLnNlbGVjdCgnKicpXG4gICAgICAudGhlbihhc3luYyAoKSA9PiB7XG4gICAgICAgIHJldHVybiBhd2FpdCBzdXBhYmFzZS5ycGMoJ2V4ZWNfc3FsJywgeyBxdWVyeTogY3JlYXRlUGxheWVyU2V0dGluZ3NUYWJsZSB9KVxuICAgICAgfSlcblxuICAgIGlmIChzZXR0aW5nc0Vycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgY3JlYXRpbmcgcGxheWVyX3NldHRpbmdzIHRhYmxlOlwiLCBzZXR0aW5nc0Vycm9yKVxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiRXJyb3IgY3JlYXRpbmcgcGxheWVyX3NldHRpbmdzIHRhYmxlXCIgfSwgeyBzdGF0dXM6IDUwMCB9KVxuICAgIH1cblxuICAgIC8vIENyZWF0ZSBiYW5zIHRhYmxlXG4gICAgY29uc3QgY3JlYXRlQmFuc1RhYmxlID0gYFxuICAgICAgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgcHVibGljLmJhbnMgKFxuICAgICAgICBpZCBTRVJJQUwgUFJJTUFSWSBLRVksXG4gICAgICAgIHV1aWQgVEVYVCxcbiAgICAgICAgdXNlcm5hbWUgVEVYVCBOT1QgTlVMTCxcbiAgICAgICAgcmVhc29uIFRFWFQgTk9UIE5VTEwsXG4gICAgICAgIGJhbm5lZF9ieSBURVhUIE5PVCBOVUxMLFxuICAgICAgICB0aW1lc3RhbXAgVElNRVNUQU1QIFdJVEggVElNRSBaT05FIERFRkFVTFQgTk9XKCksXG4gICAgICAgIGR1cmF0aW9uX21pbnV0ZXMgSU5URUdFUiBERUZBVUxUIDAsXG4gICAgICAgIHNvdXJjZSBURVhUIERFRkFVTFQgJ3dlYicsXG4gICAgICAgIGFjdGl2ZSBCT09MRUFOIERFRkFVTFQgdHJ1ZVxuICAgICAgKTtcbiAgICAgIFxuICAgICAgQ1JFQVRFIElOREVYIElGIE5PVCBFWElTVFMgaWR4X2JhbnNfdXNlcm5hbWUgT04gcHVibGljLmJhbnModXNlcm5hbWUpO1xuICAgICAgQ1JFQVRFIElOREVYIElGIE5PVCBFWElTVFMgaWR4X2JhbnNfdXVpZCBPTiBwdWJsaWMuYmFucyh1dWlkKTtcbiAgICAgIENSRUFURSBJTkRFWCBJRiBOT1QgRVhJU1RTIGlkeF9iYW5zX2FjdGl2ZSBPTiBwdWJsaWMuYmFucyhhY3RpdmUpO1xuICAgIGBcblxuICAgIGNvbnN0IHsgZXJyb3I6IGJhbnNFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAgIC5mcm9tKCdfc3VwYWJhc2Vfc2NoZW1hJylcbiAgICAgIC5zZWxlY3QoJyonKVxuICAgICAgLnRoZW4oYXN5bmMgKCkgPT4ge1xuICAgICAgICByZXR1cm4gYXdhaXQgc3VwYWJhc2UucnBjKCdleGVjX3NxbCcsIHsgcXVlcnk6IGNyZWF0ZUJhbnNUYWJsZSB9KVxuICAgICAgfSlcblxuICAgIGlmIChiYW5zRXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjcmVhdGluZyBiYW5zIHRhYmxlOlwiLCBiYW5zRXJyb3IpXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJFcnJvciBjcmVhdGluZyBiYW5zIHRhYmxlXCIgfSwgeyBzdGF0dXM6IDUwMCB9KVxuICAgIH1cblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBtZXNzYWdlOiBcIlRhYmxlcyBzdWNjZXNzZnVsbHkgaW5pdGlhbGl6ZWRcIixcbiAgICB9KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBkdXJpbmcgdGFibGUgaW5pdGlhbGl6YXRpb246XCIsIGVycm9yKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IFwiQW4gZXJyb3Igb2NjdXJyZWQ6IFwiICsgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSkgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfSxcbiAgICApXG4gIH1cbn0iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiY3JlYXRlU2VydmVyU3VwYWJhc2VDbGllbnQiLCJHRVQiLCJzdXBhYmFzZSIsImNyZWF0ZVBsYXllclNldHRpbmdzVGFibGUiLCJlcnJvciIsInNldHRpbmdzRXJyb3IiLCJmcm9tIiwic2VsZWN0IiwidGhlbiIsInJwYyIsInF1ZXJ5IiwiY29uc29sZSIsImpzb24iLCJzdGF0dXMiLCJjcmVhdGVCYW5zVGFibGUiLCJiYW5zRXJyb3IiLCJtZXNzYWdlIiwiRXJyb3IiLCJTdHJpbmciXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/initialize-tables/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase.ts":
/*!*************************!*\
  !*** ./lib/supabase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createClientSupabaseClient: () => (/* binding */ createClientSupabaseClient),\n/* harmony export */   createServerSupabaseClient: () => (/* binding */ createServerSupabaseClient)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\n// For server-side calls\nconst createServerSupabaseClient = ()=>{\n    const supabaseUrl = \"https://vefhpdjiqxugnykucfep.supabase.co\";\n    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;\n    if (!supabaseUrl || !supabaseKey) {\n        throw new Error(\"Missing Supabase environment variables for server client\");\n    }\n    return (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseKey, {\n        auth: {\n            persistSession: false\n        }\n    });\n};\n// For client-side calls (Singleton pattern)\nlet clientSupabaseInstance = null;\nconst createClientSupabaseClient = ()=>{\n    if (true) {\n        throw new Error(\"createClientSupabaseClient should only be called in browser context\");\n    }\n    if (clientSupabaseInstance) return clientSupabaseInstance;\n    const supabaseUrl = \"https://vefhpdjiqxugnykucfep.supabase.co\";\n    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;\n    if (!supabaseUrl || !supabaseKey) {\n        throw new Error(\"Missing Supabase environment variables for client\");\n    }\n    clientSupabaseInstance = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseKey, {\n        auth: {\n            persistSession: true,\n            storageKey: 'supabase.auth.token'\n        }\n    });\n    return clientSupabaseInstance;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQW9EO0FBRXBELHdCQUF3QjtBQUNqQixNQUFNQyw2QkFBNkI7SUFDeEMsTUFBTUMsY0FBY0MsMENBQW9DO0lBQ3hELE1BQU1HLGNBQWNILFFBQVFDLEdBQUcsQ0FBQ0cseUJBQXlCO0lBRXpELElBQUksQ0FBQ0wsZUFBZSxDQUFDSSxhQUFhO1FBQ2hDLE1BQU0sSUFBSUUsTUFBTTtJQUNsQjtJQUVBLE9BQU9SLG1FQUFZQSxDQUFDRSxhQUFhSSxhQUFhO1FBQzVDRyxNQUFNO1lBQ0pDLGdCQUFnQjtRQUNsQjtJQUNGO0FBQ0YsRUFBQztBQUVELDRDQUE0QztBQUM1QyxJQUFJQyx5QkFBaUU7QUFFOUQsTUFBTUMsNkJBQTZCO0lBQ3hDLElBQUksSUFBNkIsRUFBRTtRQUNqQyxNQUFNLElBQUlKLE1BQU07SUFDbEI7SUFFQSxJQUFJRyx3QkFBd0IsT0FBT0E7SUFFbkMsTUFBTVQsY0FBY0MsMENBQW9DO0lBQ3hELE1BQU1HLGNBQWNILFFBQVFDLEdBQUcsQ0FBQ1MsNkJBQTZCO0lBRTdELElBQUksQ0FBQ1gsZUFBZSxDQUFDSSxhQUFhO1FBQ2hDLE1BQU0sSUFBSUUsTUFBTTtJQUNsQjtJQUVBRyx5QkFBeUJYLG1FQUFZQSxDQUFDRSxhQUFhSSxhQUFhO1FBQzlERyxNQUFNO1lBQ0pDLGdCQUFnQjtZQUNoQkksWUFBWTtRQUNkO0lBQ0Y7SUFFQSxPQUFPSDtBQUNULEVBQUMiLCJzb3VyY2VzIjpbIi9ob21lL3Byb2plY3QvbGliL3N1cGFiYXNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gXCJAc3VwYWJhc2Uvc3VwYWJhc2UtanNcIlxuXG4vLyBGb3Igc2VydmVyLXNpZGUgY2FsbHNcbmV4cG9ydCBjb25zdCBjcmVhdGVTZXJ2ZXJTdXBhYmFzZUNsaWVudCA9ICgpID0+IHtcbiAgY29uc3Qgc3VwYWJhc2VVcmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkxcbiAgY29uc3Qgc3VwYWJhc2VLZXkgPSBwcm9jZXNzLmVudi5TVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZXG5cbiAgaWYgKCFzdXBhYmFzZVVybCB8fCAhc3VwYWJhc2VLZXkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIFN1cGFiYXNlIGVudmlyb25tZW50IHZhcmlhYmxlcyBmb3Igc2VydmVyIGNsaWVudFwiKVxuICB9XG5cbiAgcmV0dXJuIGNyZWF0ZUNsaWVudChzdXBhYmFzZVVybCwgc3VwYWJhc2VLZXksIHtcbiAgICBhdXRoOiB7XG4gICAgICBwZXJzaXN0U2Vzc2lvbjogZmFsc2VcbiAgICB9XG4gIH0pXG59XG5cbi8vIEZvciBjbGllbnQtc2lkZSBjYWxscyAoU2luZ2xldG9uIHBhdHRlcm4pXG5sZXQgY2xpZW50U3VwYWJhc2VJbnN0YW5jZTogUmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlQ2xpZW50PiB8IG51bGwgPSBudWxsXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVDbGllbnRTdXBhYmFzZUNsaWVudCA9ICgpID0+IHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiY3JlYXRlQ2xpZW50U3VwYWJhc2VDbGllbnQgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGluIGJyb3dzZXIgY29udGV4dFwiKVxuICB9XG5cbiAgaWYgKGNsaWVudFN1cGFiYXNlSW5zdGFuY2UpIHJldHVybiBjbGllbnRTdXBhYmFzZUluc3RhbmNlXG5cbiAgY29uc3Qgc3VwYWJhc2VVcmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkxcbiAgY29uc3Qgc3VwYWJhc2VLZXkgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWVxuXG4gIGlmICghc3VwYWJhc2VVcmwgfHwgIXN1cGFiYXNlS2V5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBTdXBhYmFzZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgZm9yIGNsaWVudFwiKVxuICB9XG5cbiAgY2xpZW50U3VwYWJhc2VJbnN0YW5jZSA9IGNyZWF0ZUNsaWVudChzdXBhYmFzZVVybCwgc3VwYWJhc2VLZXksIHtcbiAgICBhdXRoOiB7XG4gICAgICBwZXJzaXN0U2Vzc2lvbjogdHJ1ZSxcbiAgICAgIHN0b3JhZ2VLZXk6ICdzdXBhYmFzZS5hdXRoLnRva2VuJ1xuICAgIH1cbiAgfSlcbiAgXG4gIHJldHVybiBjbGllbnRTdXBhYmFzZUluc3RhbmNlXG59Il0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsImNyZWF0ZVNlcnZlclN1cGFiYXNlQ2xpZW50Iiwic3VwYWJhc2VVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwic3VwYWJhc2VLZXkiLCJTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIiwiRXJyb3IiLCJhdXRoIiwicGVyc2lzdFNlc3Npb24iLCJjbGllbnRTdXBhYmFzZUluc3RhbmNlIiwiY3JlYXRlQ2xpZW50U3VwYWJhc2VDbGllbnQiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSIsInN0b3JhZ2VLZXkiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Finitialize-tables%2Froute&page=%2Fapi%2Finitialize-tables%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Finitialize-tables%2Froute.ts&appDir=%2Fhome%2Fproject%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fproject&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Finitialize-tables%2Froute&page=%2Fapi%2Finitialize-tables%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Finitialize-tables%2Froute.ts&appDir=%2Fhome%2Fproject%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fproject&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_project_app_api_initialize_tables_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/initialize-tables/route.ts */ \"(rsc)/./app/api/initialize-tables/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/initialize-tables/route\",\n        pathname: \"/api/initialize-tables\",\n        filename: \"route\",\n        bundlePath: \"app/api/initialize-tables/route\"\n    },\n    resolvedPagePath: \"/home/project/app/api/initialize-tables/route.ts\",\n    nextConfigOutput,\n    userland: _home_project_app_api_initialize_tables_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZpbml0aWFsaXplLXRhYmxlcyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGaW5pdGlhbGl6ZS10YWJsZXMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZpbml0aWFsaXplLXRhYmxlcyUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcHJvamVjdCUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGaG9tZSUyRnByb2plY3QmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ0E7QUFDN0U7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9ob21lL3Byb2plY3QvYXBwL2FwaS9pbml0aWFsaXplLXRhYmxlcy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvaW5pdGlhbGl6ZS10YWJsZXMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9pbml0aWFsaXplLXRhYmxlc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvaW5pdGlhbGl6ZS10YWJsZXMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvaG9tZS9wcm9qZWN0L2FwcC9hcGkvaW5pdGlhbGl6ZS10YWJsZXMvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Finitialize-tables%2Froute&page=%2Fapi%2Finitialize-tables%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Finitialize-tables%2Froute.ts&appDir=%2Fhome%2Fproject%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fproject&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Finitialize-tables%2Froute&page=%2Fapi%2Finitialize-tables%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Finitialize-tables%2Froute.ts&appDir=%2Fhome%2Fproject%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fproject&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();