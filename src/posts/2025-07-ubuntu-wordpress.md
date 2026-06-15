---
title: Ubuntu ServerにWordPressをインストールする
author: 青木
date: 2025-07-08
category: server
tags: server,ubuntu,linux,wordpress
heading: wordpressをインストールし、cloudflare Tunnelを使用して公開する方法を紹介します
thumbnail: https://pic.atserver186.jp/img/tohofes/thumbnail/webp/no-image.webp
---

今回はProxmoxにインストールしたUbuntu ServerにWordPressをインストールします。

# 使用するソフト

- Apache2
- PHP
- MySql
- MariaDB
- Cloudflare
- WordPress

また、インターネットに公開するために、Cloudflare Tunnelを使用するので、ドメインのネームサーバーをCloudflareに変更し、登録しておきましょう。

# ソフトをインストールする

まずいちいちsudoと打つのは面倒なのでsuになりましょう

```
sudo su
```

<img src="https://atserver186.jp/Service/Blog/img/686b82d64d33a.png" alt="username@servername:$~>_">
から
<img src="https://atserver186.jp/Service/Blog/img/686b8301572a0.png" alt="root@servername:/home/username#_">
になる

- Apache2

```
apt install apache2
```

動作確認

```
systemctl status apache2.service
```

と入力し、以下のように表示されていればきちんとインストールされています。

<img src="https://atserver186.jp/Service/Blog/img/686b7ea071803.png" alt=""Active : active(running)>

- PHP , MySql

```
apt install php php-mysql
```

動作確認

```
php -v
```

と入力し、以下のように表示されていればきちんとインストールされています。
<img src="https://atserver186.jp/Service/Blog/img/686b83ed2c7ef.png" alt="">

- MariaDB

```
apt install mariadb-server mariadb-client
```

動作確認

```
mariadb
```

と入力し、以下のように表示されていればきちんとインストールされています。

```
MariaDB[(none)]
```

- Cloudflare
  まずCloudflareリポジトリのGPG鍵を追加

```
mkdir -p /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg \
  | tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
```

次にaptソースリストを登録

```
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] \
  https://pkg.cloudflare.com/cloudflared any main" \
  | tee /etc/apt/sources.list.d/cloudflared.list
```

Cloudflareをインストール

```
apt update
apt install cloudflared
```

動作確認

```
cloudflared --version
```

と入力し、以下のように表示されていればきちんとインストールされています。
<img src="https://atserver186.jp/Service/Blog/img/686b8753be496.png" alt="">

次にTunnelの設定をしましょう。

- https://dash.cloudflare.com/ でご自身のドメインを選択し、サイドバーの「Access」を開きます。
  そうすると、「Zero Trustを起動する」というボタンが現れるのでクリックしCloudflareに登録したアカウントを選択します。
- https://one.dash.cloudflare.com/(人による)/home/quick-start が開くのでサイドバーの「ネットワーク」をクリックし、展開されたTunnelsをクリックします。
- 「トンネルを作成する」をクリックします。
  <img src="https://atserver186.jp/Service/Blog/img/686d13665d09a.png" alt="">
- 「Cloudflare」をクリックし任意の文字列でトンネルを作成します。
  そうしたら作成したトンネルをクリックし、「編集」をクリックします。
- 「環境を選択」でDebianを選択
- <img src="https://atserver186.jp/Service/Blog/img/686d144d458c1.png">
  画像の赤線で囲まれた部分をコピーしUbuntu Serverに貼り付けます。
  そうすればOS起動時に自動でトンネルが起動されTunnel Errorにキレずに済みます。
  最後にUbuntu server側でCloudflareにログインしましょう。

```
cloudflared login
```

<img src="#">
上の画像のようにURLが出てくるのでクリックし画面の指示に従って設定を済ませましょう。
完了すればWebサイトにページを閉じてくださいという趣旨の文章が出てきます。

# WordPress用のデータベースを作成する

- 以下のコマンドで MariaDBを起動

```
mariadb
```

- MariaDBのShellで以下のコマンドを実行し、データベースを作成

```
CREATE DATABASE wordpress DEFAULT CHARACTER SET utf8;
```

この時、「wordpress」は自由に変えて問題ないです。まぁwordpressのままにしておいたほうが楽ではあります。

- ユーザー作成＆権限付与

```
GRANT ALL ON wordpress.* TO wordpress@localhost IDENTIFIED BY 'password';
```
*TOの後のwordpressと、BYの後のpasswordはご自身で設定してください。これはちゃんと変えてください。4. 権限更新を適用
```
FLUSH PRIVILEGES;
```
5.MariaDBのshellから退出する
```
exit
```

・最後にWordPressをインストールしましょう
まずWordPressを配置するapache2のルートディレクトリにcdします。
```
cd /var/www/html
```
次にWordPressのホームページからWordPressをダウンロードします
```
wget https://ja.wordpress.org/latest-ja.tar.gz
```
次にダウンロードしたファイルを展開します
```
tar xvf latest-ja.tar.gz
```
最後にフォルダに権限を与えます。
この時最後の「.」をつけ忘れるとエラー吐くので注意しましょう。
```
chown -R www-data:www-data .
```

これでデータベースの設定は終わりです。
ここで設定したユーザー名・パスワードを忘れると面倒なのできちんと記録しておきましょう。

# WordPressの初期設定をする

ではブラウザで 「サーバーのip/wordpress」を開き初期設定をしていきましょう。（例:192.168.11.39/wordpress）
以下の画像たちに従って設定してください。1.「さぁ、始めましょう！」をクリック
<img src="https://atserver186.jp/Service/Blog/img/686e4fcd921fa.png"> 2.先ほど設定したDBの名前、ユーザー名、パスワードを入力して「送信」をクリックしましょう。
この時、WordPressをインストールしたサーバーにDBを立てた場合は「データベースのホスト名」を変更する必要はありません。
また、「テーブルの接頭辞」も変更する必要はありません。
<img src="https://atserver186.jp/Service/Blog/img/686e4fd6676e6.png"> 3.「インストールを実行」をクリック
<img src="https://atserver186.jp/Service/Blog/img/686e4fdf77434.png"> 4.「ようこそ」画面が表示されるので入力します。5.左下の「WordPressをインストール」をクリック
<img src="https://atserver186.jp/Service/Blog/img/686e4fea84b47.png"> 6.「ログイン」をクリックし、先ほど設定したID、PWでログインする。

# 公開前の修正

現在の構成だとそのまま外部に公開するとおかしくなったり、URLが「サーバーのip/wordpress」と、「/wordpress がURLに含まれてしまうので、Apache2のルートディレクトリを変更します。

まず1つ目。
WordPressに必要なモジュールをインストールします。
```
apt install -y php-curl php-xml php-mbstring \
php-zip php-intl php-imagick # curl, dom(xml), mbstring, zip, intl, imagick
```

次にルートディレクトリを変更
以下のコマンドを実行し、

```
nano /etc/apache2/apache2.conf
```

下の方にある

```
<Directory />
Options indexes FollowSymLinks
AllowOverride None
Require all denied
</Directory>

<Directory /usr/share>
AllowOverride None
Require all granted
</Directory>

<Directory /var/www/>
Options FollowSymLinks
AllowOverride None
Require all granted
</Directory>
```

を以下のように書き換えます。

```
<Directory />
Options FollowSymLinks #indexesを削除し、ディレクトリを一覧表示させないようにする
AllowOverride None
Require all denied
</Directory>

<Directory /usr/share>
AllowOverride None
Require all granted
</Directory>

<Directory /var/www/html/wordpress> #ルートディレクトリを変更
Options FollowSymLinks
AllowOverride None
Require all granted
</Directory>
```

次にもう一つあるルートディレクトリを設定しているコンフィグファイルの設定を変更します。
以下のコマンドでコンフィグファイルを開き、

```
nano /etc/apache2/sites-available/000-default.conf
```

DocumentRootのディレクトリ部分にwordpressを追加します。

```
DocumentRoot /var/www/html
```

から以下のように変更します。

```
DocumentRoot /var/www/html/wordpress
```

これでルートディレクトリは変更できました。
以下のコマンドでApacheを再起動しましょう。

```
systemctl restart apache2.service
```

次に記事で使用する画像・動画やWPテーマをアップロードできるようにPHPの設定を変更しましょう。
この記事では最大512MBのファイルをアップロードできるよう設定しますがもっと大きなファイルをアップロードしたい場合はご自身で
「=」の後の値を増やして設定してください。1.以下のコマンドを実行し、コンフィグファイルを開きます

```
nano /etc/php/8.3/apache2/php.ini
```

2. 「upload_max_filesize」,「post_max_size」,「memory_limit」,「max_execution_time」,「max_input_time」の値を以下のように変更します。

```
upload_max_filesize = 512M
post_max_size = 512M
memory_limit = 1024M
max_execution_time = 600
max_input_time = 600
```

最後に以下のコマンドでApacheを再起動しましょう。

```
systemctl restart apache2.service
```

これで大きなファイルをアップロードできるようになりました。

# Cloudflare Tunnelによる公開

最後にCloudflare Tunnelでドメイン付きで外部に公開しましょう。1.サーバーにTunnelをインストールした時と同じようにCloudflareのダッシュボードに入ります。( https://one.dash.cloudflare.com/ )ネットワークタブの「Tunnel」をクリックし2.先ほど作成したトンネルをクリック3.「編集」をクリック4.「パブリックホスト名を」クリック5.「パブリックホスト名を追加」をクリック6.サブドメイン、ドメインを入力・選択7.サービス欄のタイプを「HTTP」、URLにWordPressをインストールしたサーバーのipを入力します。8.このままだと設定したサブドメイン.ドメインを入力しても管理画面にアクセスできないので、
そこの設定をしていきます。

まずhttp://サーバーのip/wp-adminから管理画面にアクセスし、
サイドバーの設定をクリック

<img src="https://atserver186.jp/Service/Blog/img/686e6063bd2a2.png">
一般設定が開くので
「WordPress アドレス (URL)」と「サイトアドレス (URL)」に先ほど設定したサブドメイン.ドメインを入力します。
次に管理画面を強制 HTTPS 化します。
まず以下のコマンドでwordpressの設定が記述されたPHPファイルを開きます

```
nano /var/www/html/wordpress/wp-config.php
```

```
<?php
```

の直後に以下のコードを追加します。

```
//-- 管理画面を強制 HTTPS 化--
define('FORCE_SSL_ADMIN', true);

// X-Forwarded-Proto を見てHTTPSと認識させる
if (
  ! empty($_SERVER['HTTP_X_FORWARDED_PROTO'])
  && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https'
) {
  $_SERVER['HTTPS'] = 'on';
}
```

これで設定は終わりです。

サービス欄のタイプを「HTTP」、URLにWordPressをインストールしたサーバーのipを入力します。
これで設定したサブドメイン.ドメイン.tldをブラウザに入力すればWordPressにアクセスできます。