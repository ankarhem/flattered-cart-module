System.register([], function(exports, module) {
  "use strict";
  return {
    execute: function() {
      const createModule = (App2) => {
        let instances = {};
        return {
          bootstrap: bootstrap$1,
          mount: mount$1.bind(null, instances, App2),
          unmount: unmount$1.bind(null, instances)
        };
      };
      const bootstrap$1 = () => {
        return;
      };
      const mount$1 = (instances, App2, el, props) => {
        if (!instances[el.id]) {
          const app = new App2({
            target: el,
            props
          });
          instances[el.id] = app;
        } else {
          console.log("Tried to mount an already mounted instance");
        }
      };
      const unmount$1 = (instances, el) => {
        if (instances[el.id]) {
          instances[el.id].$destroy ? instances[el.id].$destroy() : instances[el.id].destroy();
          delete instances[el.id];
        } else {
          console.log("Tried to unmount an already unmounted instance");
        }
      };
      function noop() {
      }
      function run(fn) {
        return fn();
      }
      function blank_object() {
        return /* @__PURE__ */ Object.create(null);
      }
      function run_all(fns) {
        fns.forEach(run);
      }
      function is_function(thing) {
        return typeof thing === "function";
      }
      function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
      }
      let src_url_equal_anchor;
      function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
          src_url_equal_anchor = document.createElement("a");
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
      }
      function is_empty(obj) {
        return Object.keys(obj).length === 0;
      }
      function subscribe(store, ...callbacks) {
        if (store == null) {
          return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
      }
      function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
      }
      function append(target, node) {
        target.appendChild(node);
      }
      function append_styles(target, style_sheet_id, styles) {
        const append_styles_to = get_root_for_style(target);
        if (!append_styles_to.getElementById(style_sheet_id)) {
          const style = element("style");
          style.id = style_sheet_id;
          style.textContent = styles;
          append_stylesheet(append_styles_to, style);
        }
      }
      function get_root_for_style(node) {
        if (!node)
          return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
          return root;
        }
        return node.ownerDocument;
      }
      function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
      }
      function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
      }
      function detach(node) {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }
      function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
          if (iterations[i])
            iterations[i].d(detaching);
        }
      }
      function element(name) {
        return document.createElement(name);
      }
      function text(data) {
        return document.createTextNode(data);
      }
      function space() {
        return text(" ");
      }
      function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
      }
      function attr(node, attribute, value) {
        if (value == null)
          node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
          node.setAttribute(attribute, value);
      }
      function children(element2) {
        return Array.from(element2.childNodes);
      }
      function set_data(text2, data) {
        data = "" + data;
        if (text2.wholeText !== data)
          text2.data = data;
      }
      let current_component;
      function set_current_component(component) {
        current_component = component;
      }
      function get_current_component() {
        if (!current_component)
          throw new Error("Function called outside component initialization");
        return current_component;
      }
      function setContext(key2, context) {
        get_current_component().$$.context.set(key2, context);
        return context;
      }
      function getContext(key2) {
        return get_current_component().$$.context.get(key2);
      }
      const dirty_components = [];
      const binding_callbacks = [];
      const render_callbacks = [];
      const flush_callbacks = [];
      const resolved_promise = Promise.resolve();
      let update_scheduled = false;
      function schedule_update() {
        if (!update_scheduled) {
          update_scheduled = true;
          resolved_promise.then(flush);
        }
      }
      function add_render_callback(fn) {
        render_callbacks.push(fn);
      }
      const seen_callbacks = /* @__PURE__ */ new Set();
      let flushidx = 0;
      function flush() {
        const saved_component = current_component;
        do {
          while (flushidx < dirty_components.length) {
            const component = dirty_components[flushidx];
            flushidx++;
            set_current_component(component);
            update(component.$$);
          }
          set_current_component(null);
          dirty_components.length = 0;
          flushidx = 0;
          while (binding_callbacks.length)
            binding_callbacks.pop()();
          for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
              seen_callbacks.add(callback);
              callback();
            }
          }
          render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
          flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
      }
      function update($$) {
        if ($$.fragment !== null) {
          $$.update();
          run_all($$.before_update);
          const dirty = $$.dirty;
          $$.dirty = [-1];
          $$.fragment && $$.fragment.p($$.ctx, dirty);
          $$.after_update.forEach(add_render_callback);
        }
      }
      const outroing = /* @__PURE__ */ new Set();
      let outros;
      function group_outros() {
        outros = {
          r: 0,
          c: [],
          p: outros
        };
      }
      function check_outros() {
        if (!outros.r) {
          run_all(outros.c);
        }
        outros = outros.p;
      }
      function transition_in(block, local) {
        if (block && block.i) {
          outroing.delete(block);
          block.i(local);
        }
      }
      function transition_out(block, local, detach2, callback) {
        if (block && block.o) {
          if (outroing.has(block))
            return;
          outroing.add(block);
          outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
              if (detach2)
                block.d(1);
              callback();
            }
          });
          block.o(local);
        } else if (callback) {
          callback();
        }
      }
      function create_component(block) {
        block && block.c();
      }
      function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
          add_render_callback(() => {
            const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
            if (component.$$.on_destroy) {
              component.$$.on_destroy.push(...new_on_destroy);
            } else {
              run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
          });
        }
        after_update.forEach(add_render_callback);
      }
      function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
          run_all($$.on_destroy);
          $$.fragment && $$.fragment.d(detaching);
          $$.on_destroy = $$.fragment = null;
          $$.ctx = [];
        }
      }
      function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
          dirty_components.push(component);
          schedule_update();
          component.$$.dirty.fill(0);
        }
        component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
      }
      function init(component, options, instance2, create_fragment2, not_equal, props, append_styles2, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
          fragment: null,
          ctx: [],
          props,
          update: noop,
          not_equal,
          bound: blank_object(),
          on_mount: [],
          on_destroy: [],
          on_disconnect: [],
          before_update: [],
          after_update: [],
          context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
          callbacks: blank_object(),
          dirty,
          skip_bound: false,
          root: options.target || parent_component.$$.root
        };
        append_styles2 && append_styles2($$.root);
        let ready = false;
        $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
          const value = rest.length ? rest[0] : ret;
          if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
            if (!$$.skip_bound && $$.bound[i])
              $$.bound[i](value);
            if (ready)
              make_dirty(component, i);
          }
          return ret;
        }) : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
        if (options.target) {
          if (options.hydrate) {
            const nodes = children(options.target);
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
          } else {
            $$.fragment && $$.fragment.c();
          }
          if (options.intro)
            transition_in(component.$$.fragment);
          mount_component(component, options.target, options.anchor, options.customElement);
          flush();
        }
        set_current_component(parent_component);
      }
      class SvelteComponent {
        $destroy() {
          destroy_component(this, 1);
          this.$destroy = noop;
        }
        $on(type, callback) {
          if (!is_function(callback)) {
            return noop;
          }
          const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
          callbacks.push(callback);
          return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
              callbacks.splice(index, 1);
          };
        }
        $set($$props) {
          if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
          }
        }
      }
      const key = Symbol();
      function add_css$1(target) {
        append_styles(target, "svelte-1lkntmg", "img.svelte-1lkntmg.svelte-1lkntmg{width:100%;height:100%;object-fit:cover}a.svelte-1lkntmg.svelte-1lkntmg{color:#000;text-decoration:none;display:inline-flex}.cart-item.svelte-1lkntmg.svelte-1lkntmg{display:flex;gap:2rem;font-size:small}.cart-item.svelte-1lkntmg>.svelte-1lkntmg{flex:1}.cart-info.svelte-1lkntmg.svelte-1lkntmg{display:flex;flex-direction:column;gap:1rem}.header-row.svelte-1lkntmg.svelte-1lkntmg{display:flex;justify-content:space-between;gap:5px;margin:0.5rem 0;align-items:center}.header-row.svelte-1lkntmg h2.svelte-1lkntmg{margin:0;font-size:medium;font-weight:400;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:30ch}.header-row.svelte-1lkntmg button.svelte-1lkntmg{display:flex;align-items:center;height:1.5rem;width:1.5rem;border:none;background:none;font-size:1.5rem;font-weight:500;margin-right:-0.4rem}.price-row.svelte-1lkntmg.svelte-1lkntmg{display:flex;justify-content:space-between;align-items:center}.quantity-wrapper.svelte-1lkntmg.svelte-1lkntmg{display:inline-flex;gap:1rem;align-items:center;font-size:0.8rem}.quantity-wrapper.svelte-1lkntmg button.svelte-1lkntmg{display:flex;align-items:center;justify-content:center;outline:none;border:none;width:12px;height:12px;padding:0;background:#000;color:#fff;border-radius:1rem;font-size:0.8rem}");
      }
      function create_fragment$1(ctx) {
        let div4;
        let img;
        let img_src_value;
        let img_alt_value;
        let t0;
        let div3;
        let div0;
        let a;
        let h2;
        let t1_value = ctx[0].name + "";
        let t1;
        let t2_value = ctx[4] ? ` - ${ctx[4]}` : "";
        let t2;
        let a_href_value;
        let t3;
        let button0;
        let t4;
        let button0_disabled_value;
        let t5;
        let div2;
        let span0;
        let t6_value = Intl.NumberFormat(ctx[1].culture, {
          currency: ctx[1].currency,
          style: "currency"
        }).format(ctx[0].price.includingVat) + "";
        let t6;
        let t7;
        let div1;
        let button1;
        let t8;
        let button1_disabled_value;
        let t9;
        let span1;
        let t10_value = ctx[0].quantity + "";
        let t10;
        let t11;
        let button2;
        let t12;
        let button2_disabled_value;
        let t13;
        let p;
        let mounted;
        let dispose;
        return {
          c() {
            div4 = element("div");
            img = element("img");
            t0 = space();
            div3 = element("div");
            div0 = element("div");
            a = element("a");
            h2 = element("h2");
            t1 = text(t1_value);
            t2 = text(t2_value);
            t3 = space();
            button0 = element("button");
            t4 = text("\xD7");
            t5 = space();
            div2 = element("div");
            span0 = element("span");
            t6 = text(t6_value);
            t7 = space();
            div1 = element("div");
            button1 = element("button");
            t8 = text("\u2212");
            t9 = space();
            span1 = element("span");
            t10 = text(t10_value);
            t11 = space();
            button2 = element("button");
            t12 = text("+");
            t13 = space();
            p = element("p");
            p.textContent = "Omg\xE5ende leverans";
            if (!src_url_equal(img.src, img_src_value = ctx[0].imageUrl))
              attr(img, "src", img_src_value);
            attr(img, "alt", img_alt_value = ctx[0].name);
            attr(img, "class", "svelte-1lkntmg");
            attr(h2, "class", "svelte-1lkntmg");
            attr(a, "href", a_href_value = ctx[0].url);
            attr(a, "class", "item-name svelte-1lkntmg");
            attr(a, "target", "_blank");
            attr(a, "rel", "noreferrer");
            button0.disabled = button0_disabled_value = ctx[1].suspended;
            attr(button0, "class", "svelte-1lkntmg");
            attr(div0, "class", "header-row svelte-1lkntmg");
            button1.disabled = button1_disabled_value = ctx[1].suspended || ctx[0].quantity === 1;
            attr(button1, "class", "svelte-1lkntmg");
            button2.disabled = button2_disabled_value = ctx[1].suspended;
            attr(button2, "class", "svelte-1lkntmg");
            attr(div1, "class", "quantity-wrapper svelte-1lkntmg");
            attr(div2, "class", "price-row svelte-1lkntmg");
            attr(div3, "class", "cart-info svelte-1lkntmg");
            attr(div4, "class", "cart-item svelte-1lkntmg");
          },
          m(target, anchor) {
            insert(target, div4, anchor);
            append(div4, img);
            append(div4, t0);
            append(div4, div3);
            append(div3, div0);
            append(div0, a);
            append(a, h2);
            append(h2, t1);
            append(h2, t2);
            append(div0, t3);
            append(div0, button0);
            append(button0, t4);
            append(div3, t5);
            append(div3, div2);
            append(div2, span0);
            append(span0, t6);
            append(div2, t7);
            append(div2, div1);
            append(div1, button1);
            append(button1, t8);
            append(div1, t9);
            append(div1, span1);
            append(span1, t10);
            append(div1, t11);
            append(div1, button2);
            append(button2, t12);
            append(div3, t13);
            append(div3, p);
            if (!mounted) {
              dispose = [
                listen(button0, "click", ctx[5]),
                listen(button1, "click", ctx[6]),
                listen(button2, "click", ctx[7])
              ];
              mounted = true;
            }
          },
          p(ctx2, [dirty]) {
            if (dirty & 1 && !src_url_equal(img.src, img_src_value = ctx2[0].imageUrl)) {
              attr(img, "src", img_src_value);
            }
            if (dirty & 1 && img_alt_value !== (img_alt_value = ctx2[0].name)) {
              attr(img, "alt", img_alt_value);
            }
            if (dirty & 1 && t1_value !== (t1_value = ctx2[0].name + ""))
              set_data(t1, t1_value);
            if (dirty & 1 && a_href_value !== (a_href_value = ctx2[0].url)) {
              attr(a, "href", a_href_value);
            }
            if (dirty & 2 && button0_disabled_value !== (button0_disabled_value = ctx2[1].suspended)) {
              button0.disabled = button0_disabled_value;
            }
            if (dirty & 3 && t6_value !== (t6_value = Intl.NumberFormat(ctx2[1].culture, {
              currency: ctx2[1].currency,
              style: "currency"
            }).format(ctx2[0].price.includingVat) + ""))
              set_data(t6, t6_value);
            if (dirty & 3 && button1_disabled_value !== (button1_disabled_value = ctx2[1].suspended || ctx2[0].quantity === 1)) {
              button1.disabled = button1_disabled_value;
            }
            if (dirty & 1 && t10_value !== (t10_value = ctx2[0].quantity + ""))
              set_data(t10, t10_value);
            if (dirty & 2 && button2_disabled_value !== (button2_disabled_value = ctx2[1].suspended)) {
              button2.disabled = button2_disabled_value;
            }
          },
          i: noop,
          o: noop,
          d(detaching) {
            if (detaching)
              detach(div4);
            mounted = false;
            run_all(dispose);
          }
        };
      }
      function instance$1($$self, $$props, $$invalidate) {
        var _a, _b;
        let $order;
        let { item } = $$props;
        const { Checkout } = getContext(key);
        Checkout.config;
        const order = Checkout.order;
        component_subscribe($$self, order, (value) => $$invalidate(1, $order = value));
        console.log(item);
        const storlek = (_b = (_a = item == null ? void 0 : item.attributes) == null ? void 0 : _a.productVariant) == null ? void 0 : _b.Storlek;
        const click_handler = () => Checkout.deleteFromCart(item.id);
        const click_handler_1 = () => Checkout.removeFromCart(item.id);
        const click_handler_2 = () => Checkout.addToCart(item.id);
        $$self.$$set = ($$props2) => {
          if ("item" in $$props2)
            $$invalidate(0, item = $$props2.item);
        };
        return [
          item,
          $order,
          Checkout,
          order,
          storlek,
          click_handler,
          click_handler_1,
          click_handler_2
        ];
      }
      class CartItem extends SvelteComponent {
        constructor(options) {
          super();
          init(this, options, instance$1, create_fragment$1, safe_not_equal, { item: 0 }, add_css$1);
        }
      }
      function add_css(target) {
        append_styles(target, "svelte-1v9juii", "h1.svelte-1v9juii{font-size:1.2rem;font-weight:500;margin:0}.wrapper.svelte-1v9juii{display:flex;flex-direction:column;align-items:center;margin-bottom:2rem;font-family:'Avenir Next', Avenir, Lato, Arial, sans-serif}.lock.svelte-1v9juii{margin-top:2rem;margin-bottom:0.5rem}.usp.svelte-1v9juii{margin:3rem auto 5rem;font-size:0.8rem}.cart.svelte-1v9juii{display:flex;flex-direction:column;gap:1rem;width:620px}");
      }
      function get_each_context(ctx, list, i) {
        const child_ctx = ctx.slice();
        child_ctx[4] = list[i];
        return child_ctx;
      }
      function create_each_block(ctx) {
        let cartitem;
        let current;
        cartitem = new CartItem({ props: { item: ctx[4] } });
        return {
          c() {
            create_component(cartitem.$$.fragment);
          },
          m(target, anchor) {
            mount_component(cartitem, target, anchor);
            current = true;
          },
          p(ctx2, dirty) {
            const cartitem_changes = {};
            if (dirty & 1)
              cartitem_changes.item = ctx2[4];
            cartitem.$set(cartitem_changes);
          },
          i(local) {
            if (current)
              return;
            transition_in(cartitem.$$.fragment, local);
            current = true;
          },
          o(local) {
            transition_out(cartitem.$$.fragment, local);
            current = false;
          },
          d(detaching) {
            destroy_component(cartitem, detaching);
          }
        };
      }
      function create_fragment(ctx) {
        var _a;
        let div1;
        let span;
        let t1;
        let h1;
        let t3;
        let p;
        let t5;
        let div0;
        let current;
        let each_value = (_a = ctx[0]) == null ? void 0 : _a.cart.items;
        let each_blocks = [];
        for (let i = 0; i < each_value.length; i += 1) {
          each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
        }
        const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
          each_blocks[i] = null;
        });
        return {
          c() {
            div1 = element("div");
            span = element("span");
            span.textContent = "\u{1F512}";
            t1 = space();
            h1 = element("h1");
            h1.textContent = "Kassa";
            t3 = space();
            p = element("p");
            p.textContent = "Free shipping and 60 days return policy.";
            t5 = space();
            div0 = element("div");
            for (let i = 0; i < each_blocks.length; i += 1) {
              each_blocks[i].c();
            }
            attr(span, "class", "lock svelte-1v9juii");
            attr(h1, "class", "svelte-1v9juii");
            attr(p, "class", "usp svelte-1v9juii");
            attr(div0, "class", "cart svelte-1v9juii");
            attr(div1, "class", "wrapper svelte-1v9juii");
          },
          m(target, anchor) {
            insert(target, div1, anchor);
            append(div1, span);
            append(div1, t1);
            append(div1, h1);
            append(div1, t3);
            append(div1, p);
            append(div1, t5);
            append(div1, div0);
            for (let i = 0; i < each_blocks.length; i += 1) {
              each_blocks[i].m(div0, null);
            }
            current = true;
          },
          p(ctx2, [dirty]) {
            var _a2;
            if (dirty & 1) {
              each_value = (_a2 = ctx2[0]) == null ? void 0 : _a2.cart.items;
              let i;
              for (i = 0; i < each_value.length; i += 1) {
                const child_ctx = get_each_context(ctx2, each_value, i);
                if (each_blocks[i]) {
                  each_blocks[i].p(child_ctx, dirty);
                  transition_in(each_blocks[i], 1);
                } else {
                  each_blocks[i] = create_each_block(child_ctx);
                  each_blocks[i].c();
                  transition_in(each_blocks[i], 1);
                  each_blocks[i].m(div0, null);
                }
              }
              group_outros();
              for (i = each_value.length; i < each_blocks.length; i += 1) {
                out(i);
              }
              check_outros();
            }
          },
          i(local) {
            if (current)
              return;
            for (let i = 0; i < each_value.length; i += 1) {
              transition_in(each_blocks[i]);
            }
            current = true;
          },
          o(local) {
            each_blocks = each_blocks.filter(Boolean);
            for (let i = 0; i < each_blocks.length; i += 1) {
              transition_out(each_blocks[i]);
            }
            current = false;
          },
          d(detaching) {
            if (detaching)
              detach(div1);
            destroy_each(each_blocks, detaching);
          }
        };
      }
      function instance($$self, $$props, $$invalidate) {
        let $order;
        let { Checkout } = $$props;
        let { EventEmitter } = $$props;
        const order = Checkout.order;
        component_subscribe($$self, order, (value) => $$invalidate(0, $order = value));
        setContext(key, { Checkout, EventEmitter });
        EventEmitter.subscribe({
          event: "add_to_cart",
          callback: async (payload) => {
            console.log("add_to_cart listener in custom module", payload);
          }
        });
        $$self.$$set = ($$props2) => {
          if ("Checkout" in $$props2)
            $$invalidate(2, Checkout = $$props2.Checkout);
          if ("EventEmitter" in $$props2)
            $$invalidate(3, EventEmitter = $$props2.EventEmitter);
        };
        return [$order, order, Checkout, EventEmitter];
      }
      class App extends SvelteComponent {
        constructor(options) {
          super();
          init(this, options, instance, create_fragment, safe_not_equal, { Checkout: 2, EventEmitter: 3 }, add_css);
        }
      }
      const { bootstrap, mount, unmount } = createModule(App);
      exports({ bootstrap, mount, unmount });
    }
  };
});
